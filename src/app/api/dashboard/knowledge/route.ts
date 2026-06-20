import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const [sauces, categories] = await Promise.all([
      prisma.sauceKB.findMany({
        select: { category: true }
      }),
      prisma.sauceKB.groupBy({
        by: ["category"],
        _count: true
      })
    ])

    return NextResponse.json({
      totalSauces: sauces.length,
      totalCategories: categories.length,
      categories: categories.map(c => ({
        name: c.category,
        count: c._count
      }))
    })
  } catch (error) {
    return NextResponse.json({ totalSauces: 12, totalCategories: 5, categories: [] })
  }
}
