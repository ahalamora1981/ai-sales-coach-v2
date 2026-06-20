import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import {
  storeKnowledgePoint,
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

    if (message && feedback === "thumbs_up") {
      // Store as knowledge point when thumbs up
      await storeKnowledgePoint(session.user.id, conversationId, message.content)
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
