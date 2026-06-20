import { prisma } from "@/lib/db"

export interface SauceRecommendation {
  sauce: string
  sauceZh?: string
  reason: string
  confidence: "high" | "medium" | "low"
}

export interface DishWithRecommendations {
  originalName: string
  englishName?: string
  recommendations: SauceRecommendation[]
}

export async function getAllSauces() {
  return prisma.sauceKB.findMany({
    orderBy: { name: "asc" },
  })
}

export async function getSauceById(id: string) {
  return prisma.sauceKB.findUnique({ where: { id } })
}

export async function getSaucesByCategory(category: string) {
  return prisma.sauceKB.findMany({
    where: { category },
    orderBy: { name: "asc" },
  })
}

export async function searchSaucesByCuisine(cuisine: string) {
  const allSauces = await prisma.sauceKB.findMany()
  return allSauces.filter((sauce: { pairingGuide: unknown; name: string; nameZh: string | null; category: string; description: string }) => {
    const pairingGuide = sauce.pairingGuide as {
      cuisines?: string[]
      dishes?: string[]
      tips?: string[]
    }
    return pairingGuide.cuisines?.some(
      (c) => c.toLowerCase() === cuisine.toLowerCase()
    )
  })
}

export async function findSaucesForDish(dishName: string) {
  const allSauces = await prisma.sauceKB.findMany()
  const matchingSauces: SauceRecommendation[] = []

  for (const sauce of allSauces) {
    const pairingGuide = sauce.pairingGuide as {
      cuisines?: string[]
      dishes?: string[]
      tips?: string[]
    }

    const dishLower = dishName.toLowerCase()
    const matchesDish = pairingGuide.dishes?.some(
      (d) =>
        d.toLowerCase().includes(dishLower) ||
        dishLower.includes(d.toLowerCase())
    )

    if (matchesDish) {
      matchingSauces.push({
        sauce: sauce.name,
        sauceZh: sauce.nameZh || undefined,
        reason: `Pairs well with ${dishName}. ${pairingGuide.tips?.[0] || ""}`,
        confidence: "high",
      })
    }
  }

  return matchingSauces
}

export async function getSauceKnowledgeForPrompt(): Promise<string> {
  const sauces = await prisma.sauceKB.findMany()

  let knowledge = "KHC Sauce Knowledge Base:\n\n"

  for (const sauce of sauces) {
    const pairingGuide = sauce.pairingGuide as {
      cuisines?: string[]
      dishes?: string[]
      tips?: string[]
    }

    knowledge += `## ${sauce.name} (${sauce.nameZh || ""})\n`
    knowledge += `Category: ${sauce.category}\n`
    knowledge += `${sauce.description}\n`

    if (pairingGuide.cuisines?.length) {
      knowledge += `Cuisines: ${pairingGuide.cuisines.join(", ")}\n`
    }

    if (pairingGuide.dishes?.length) {
      knowledge += `Recommended Dishes: ${pairingGuide.dishes.join(", ")}\n`
    }

    if (pairingGuide.tips?.length) {
      knowledge += `Usage Tips:\n`
      pairingGuide.tips.forEach((tip) => {
        knowledge += `- ${tip}\n`
      })
    }

    knowledge += "\n"
  }

  return knowledge
}

export function parseSauceRecommendationsFromAI(
  aiResponse: string
): DishWithRecommendations[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.dishes && Array.isArray(parsed.dishes)) {
        return parsed.dishes
      }
    }
  } catch {
    // If JSON parsing fails, return empty array
    console.error("Failed to parse AI response as JSON")
  }

  return []
}
