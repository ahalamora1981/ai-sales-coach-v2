import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ memories: [], stats: { knowledge: 0, preference: 0, restaurant: 0, scenario: 0, total: 0 } })
  }

  try {
    const userId = session.user.id

    const memories = await prisma.userMemory.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 100,
    })

    // Calculate stats
    const stats = {
      knowledge: memories.filter((m) => m.memoryType === "knowledge").length,
      preference: memories.filter((m) => m.memoryType === "preference").length,
      restaurant: memories.filter((m) => m.memoryType === "restaurant").length,
      scenario: memories.filter((m) => m.memoryType === "scenario").length,
      total: memories.length,
    }

    return NextResponse.json({ memories, stats })
  } catch (error) {
    console.error("Failed to fetch memories:", error)
    return NextResponse.json({ memories: [], stats: { knowledge: 0, preference: 0, restaurant: 0, scenario: 0, total: 0 } })
  }
}
