import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

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

    // Store feedback as memory for adaptive learning
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (message) {
      // Create a memory based on the feedback
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
