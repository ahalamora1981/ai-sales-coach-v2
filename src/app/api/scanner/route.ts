import { NextResponse } from "next/server"
import { getProvider } from "@/lib/ai/providers"
import {
  MENU_ANALYSIS_PROMPT,
  buildPersonalizedPrompt,
} from "@/lib/ai/prompts"
import { findSaucesForDish } from "@/lib/ai/sauce-kb"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { storeProductKnowledge, storeRestaurantMemory } from "@/lib/ai/memory"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { image, locale = "en" } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Get Qwen provider (only Qwen supports vision)
    const provider = getProvider("qwen")

    // Add locale instruction to prompt
    const localizedPrompt = `${MENU_ANALYSIS_PROMPT}\n\nLocale: ${locale}\n${locale === "zh" ? "请用中文回答所有内容。" : "Please respond in English."}`

    // Analyze menu with Vision AI
    const aiResponse = await provider.analyzeImage(image, localizedPrompt)

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
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        dishes = parsed.dishes || []
      }
    } catch {
      console.error("Failed to parse AI response as JSON")
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
        title: `Menu Scan - ${new Date().toLocaleDateString()}`,
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

    // Store memories from this scan
    try {
      // Extract all sauce names from recommendations
      const allSauceNames = dishes
        .flatMap((d) => d.recommendations.map((r) => r.sauce))
        .join(", ")
      
      // Create a fake AI response with sauce names for memory extraction
      const fakeAiResponse = `Recommended sauces: ${allSauceNames}`
      const fakeUserMessage = dishes.map((d) => d.originalName).join(", ")
      
      // Store product knowledge and restaurant memory
      await Promise.all([
        storeProductKnowledge(session.user.id, fakeUserMessage, fakeAiResponse),
        storeRestaurantMemory(session.user.id, {
          dishes: dishes.map(d => ({
            originalName: d.originalName,
            englishName: d.englishName,
            recommendations: d.recommendations.map(r => ({
              sauce: r.sauce,
              reason: r.reason,
            })),
          })),
        }),
      ])
    } catch (memoryError) {
      // Memory storage errors shouldn't break the scanner
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
