import { NextResponse } from "next/server"
import { getProvider } from "@/lib/ai/providers"
import { MENU_ANALYSIS_PROMPT } from "@/lib/ai/prompts"
import { findSaucesForDish } from "@/lib/ai/sauce-kb"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { storeRestaurantMemory } from "@/lib/ai/memory"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, locale = "en" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Get Qwen provider
    const provider = getProvider("qwen")

    // Build prompt for text menu analysis
    const prompt = `${MENU_ANALYSIS_PROMPT}\n\nLocale: ${locale}\n${locale === "zh" ? "请用中文回答所有内容。" : "Please respond in English."}\n\nCRITICAL: Return ONLY a valid JSON object. No explanations, no text before or after the JSON.`

    // Create messages for text-based analysis
    const messages = [
      { role: "system" as const, content: prompt },
      { role: "user" as const, content: `Analyze this menu and recommend KHC sauces for each dish:\n\n${text}` },
    ]

    // Call LLM (non-streaming for JSON response)
    const aiResponse = await provider.chat(messages)

    // Parse AI response
    let dishes: Array<{
      originalName: string
      englishName?: string
      recommendations: Array<{
        sauce: string
        sauceZh?: string
        reason: string
        confidence: string
      }>
    }> = []

    try {
      // Try to extract JSON from the response
      const firstBrace = aiResponse.indexOf("{")
      const lastBrace = aiResponse.lastIndexOf("}")

      if (firstBrace !== -1 && lastBrace > firstBrace) {
        const jsonString = aiResponse.substring(firstBrace, lastBrace + 1)
        const parsed = JSON.parse(jsonString)
        dishes = parsed.dishes || []
      }
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e)
      console.error("AI Response preview:", aiResponse.substring(0, 500))
    }

    // Enhance recommendations with local sauce KB data
    for (const dish of dishes) {
      const localSauces = await findSaucesForDish(dish.originalName)

      // Merge AI recommendations with local data
      for (const rec of dish.recommendations) {
        const localMatch = localSauces.find(
          (ls) => ls.sauce.toLowerCase().includes(rec.sauce.toLowerCase().split("(")[0].trim().toLowerCase())
        )
        if (localMatch) {
          rec.sauceZh = localMatch.sauceZh
        }
      }

      // Add local recommendations if AI missed any
      for (const local of localSauces) {
        const exists = dish.recommendations.some(
          (r) => r.sauce.toLowerCase() === local.sauce.toLowerCase()
        )
        if (!exists) {
          dish.recommendations.push(local)
        }
      }
    }

    // Save scan results to database
    const conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        title: `Text Menu Scan - ${new Date().toLocaleDateString()}`,
        model: "qwen",
        type: "scan",
      },
    })

    for (const dish of dishes) {
      await prisma.menuItem.create({
        data: {
          conversationId: conversation.id,
          originalName: dish.originalName,
          englishName: dish.englishName,
          recommendations: dish.recommendations,
        },
      })
    }

    // Store restaurant memory from this scan
    try {
      await storeRestaurantMemory(session.user.id, {
        dishes: dishes.map(d => ({
          originalName: d.originalName,
          englishName: d.englishName,
          recommendations: d.recommendations.map(r => ({
            sauce: r.sauce,
            reason: r.reason,
          })),
        })),
      })
    } catch (memoryError) {
      console.error("Memory storage error:", memoryError)
    }

    return NextResponse.json({ dishes, conversationId: conversation.id })
  } catch (error) {
    console.error("Scanner error:", error)
    return NextResponse.json(
      { error: "Failed to analyze menu" },
      { status: 500 }
    )
  }
}
