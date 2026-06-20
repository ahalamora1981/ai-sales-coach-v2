import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import {
  detectScenarioType,
  detectStruggle,
  storeScenarioMemory,
} from "@/lib/ai/memory"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messageId, feedback, conversationId } = await request.json()

    if (!messageId || !feedback) {
      return NextResponse.json(
        { error: "Missing messageId or feedback" },
        { status: 400 }
      )
    }

    // Update message with feedback
    await prisma.message.update({
      where: { id: messageId },
      data: { feedback },
    })

    // Get the message and its conversation context
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
              take: 10,
            },
          },
        },
      },
    })

    if (message) {
      // Find the user message that preceded this AI response
      const messageIndex = message.conversation.messages.findIndex(
        (m) => m.id === messageId
      )
      const userMessage =
        messageIndex > 0
          ? message.conversation.messages[messageIndex - 1]
          : null

      // Detect scenario type from the conversation
      const scenarioType = detectScenarioType(
        (userMessage?.content || "") + " " + message.content
      )

      // Detect struggle if thumbs down
      const { isStruggle, strugglePoints } = detectStruggle(
        userMessage?.content || "",
        message.content,
        feedback
      )

      // Store as scenario memory
      await storeScenarioMemory(session.user.id, conversationId, {
        scenarioType,
        outcome: isStruggle ? "struggle" : "success",
        strugglePoints,
        userMessage: userMessage?.content || "",
        aiResponse: message.content,
      })

      // Also store as general memory for backward compatibility
      const memoryType = feedback === "thumbs_up" ? "preference" : "mistake"
      const memoryContent =
        feedback === "thumbs_up"
          ? `User liked this response about: ${message.content.slice(0, 100)}...`
          : `User disliked this response about: ${message.content.slice(0, 100)}...`

      await prisma.userMemory.create({
        data: {
          userId: session.user.id,
          memoryType,
          content: memoryContent,
          metadata: {
            messageId,
            conversationId,
            feedback,
            scenarioType,
          },
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback error:", error)
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    )
  }
}
