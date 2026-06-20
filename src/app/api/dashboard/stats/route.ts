import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id

    const [scanCount, chatCount] = await Promise.all([
      prisma.conversation.count({
        where: { userId, type: "scanner" }
      }),
      prisma.conversation.count({
        where: { userId, type: "chat" }
      })
    ])

    return NextResponse.json({ scanCount, chatCount })
  } catch (error) {
    return NextResponse.json({ scanCount: 0, chatCount: 0 })
  }
}
