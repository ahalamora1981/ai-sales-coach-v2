import { NextResponse } from "next/server"
import { getProvider } from "@/lib/ai/providers"
import { SALES_COACH_PROMPT, buildPersonalizedPrompt } from "@/lib/ai/prompts"
import { getSauceKnowledgeForPrompt } from "@/lib/ai/sauce-kb"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import {
  getKnowledgeContext,
  getRestaurantContext,
  storeProductKnowledge,
  storePreferences,
} from "@/lib/ai/memory"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      message,
      model,
      conversationId,
      locale = "en",
      isContextInit = false,
    } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    // Get user profile for personalization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    // Get memory context (product knowledge + preferences + restaurants)
    const [knowledgeContext, restaurantContext] = await Promise.all([
      getKnowledgeContext(session.user.id),
      getRestaurantContext(session.user.id),
    ])

    // Build personalized system prompt
    const sauceKnowledge = await getSauceKnowledgeForPrompt()
    const localeInstruction =
      locale === "zh"
        ? "\n\n**请用中文回复所有内容。**"
        : "\n\n**Please respond in English.**"
    const basePrompt =
      SALES_COACH_PROMPT + "\n\n" + sauceKnowledge + localeInstruction

    const systemPrompt = buildPersonalizedPrompt(
      basePrompt + knowledgeContext + restaurantContext,
      {
        name: user?.name,
        experience: user?.experience,
        preferences: user?.preferences as {
          cuisine?: string[]
          region?: string[]
        } | null,
      }
    )

    // Get or create conversation
    let convId = conversationId
    let conversation

    if (!convId) {
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
          model,
          type: "chat",
        },
      })
      convId = conversation.id
    } else {
      conversation = await prisma.conversation.findUnique({
        where: { id: convId },
      })
    }

    // Save user message (skip for context initialization)
    if (!isContextInit) {
      await prisma.message.create({
        data: {
          conversationId: convId,
          role: "user",
          content: message,
        },
      })
    }

    // Get conversation history for context
    const history = await prisma.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: "asc" },
      take: 20,
    })

    // Build messages array for LLM
    const llmMessages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ]

    // For context init, add context as a user message
    if (isContextInit) {
      llmMessages.push({
        role: "user" as const,
        content: `我刚用菜单精灵扫了一道菜，信息如下：\n\n${message}\n\n请基于以上信息，主动问我关于这道菜销售的问题。记得提及具体的菜品名称和推荐的酱料。`,
      })
    }

    // Get LLM provider and create streaming response
    const provider = getProvider(model)

    // Create a ReadableStream for streaming
    const encoder = new TextEncoder()
    let fullResponse = ""

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of provider.chatStream(llmMessages)) {
            fullResponse += chunk
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    // Create a new stream that saves the message and stores memories after completion
    const convIdForSave = convId
    const modelForSave = model
    const historyLength = history.length
    const messageForTitle = message
    const userIdForMemory = session.user.id

    const wrappedStream = new ReadableStream({
      async start(controller) {
        try {
          // Tee the original stream to read it
          const reader = stream.getReader()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }

          controller.close()

          // Save message after stream is fully consumed
          if (fullResponse) {
            await prisma.message.create({
              data: {
                conversationId: convIdForSave,
                role: "assistant",
                content: fullResponse,
                model: modelForSave,
              },
            })

            // Update conversation title if first message
            if (historyLength <= 1) {
              await prisma.conversation.update({
                where: { id: convIdForSave },
                data: {
                  title:
                    messageForTitle.slice(0, 50) +
                    (messageForTitle.length > 50 ? "..." : ""),
                },
              })
            }

            // Store memories from this interaction
            try {
              await Promise.all([
                storeProductKnowledge(userIdForMemory, message, fullResponse),
                storePreferences(userIdForMemory, message),
              ])
            } catch (memoryError) {
              // Memory storage errors shouldn't break the chat
              console.error("Memory storage error:", memoryError)
            }
          }
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(wrappedStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Conversation-Id": convId,
      },
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}
