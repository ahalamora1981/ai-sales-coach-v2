import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ scanCount: 0, chatCount: 0 })
  }

  try {
    const userId = session.user.id

    const [scanCount, chatCount] = await Promise.all([
      prisma.conversation.count({
        where: { userId, type: "scan" }
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
