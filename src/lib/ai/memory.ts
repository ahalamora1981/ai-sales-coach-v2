import { prisma } from "@/lib/db"
import { sauceKnowledgeBase } from "@/lib/knowledge-data"

// ============================================================
// Types
// ============================================================

export interface MemoryContext {
  userProfile: {
    name?: string | null
    experience?: string | null
    preferences?: { cuisine?: string[]; region?: string[] } | null
  }
  knownSauces: string[]
  recentTopics: string[]
  preferences: Array<{ content: string; confidence: number }>
}

// ============================================================
// Known Sauces List (for extraction)
// ============================================================

const SAUCE_KEYWORDS: Record<string, string[]> = {
  "Chili Garlic Sauce": ["chili garlic", "蒜蓉辣酱", "蒜蓉"],
  "Sriracha": ["sriracha", "是拉差"],
  "Sambal Oelek": ["sambal", "叁巴"],
  "Premium Soy Sauce": ["premium soy", "生抽", "酱油"],
  "Mushroom Soy Sauce": ["mushroom soy", "草菇酱油", "草菇"],
  "Classic Oyster Sauce": ["oyster sauce", "蚝油"],
  "Mushroom Oyster Sauce": ["mushroom oyster", "素蚝油"],
  "Hoisin Sauce": ["hoisin", "海鲜酱"],
  "Chinese BBQ Sauce": ["bbq sauce", "烧烤酱"],
  "Doubanjiang": ["doubanjiang", "豆瓣酱", "豆瓣"],
  "Fermented Black Bean": ["black bean", "豆豉"],
  "Sweet Chili Sauce": ["sweet chili", "甜辣酱"],
}

const CUISINE_KEYWORDS: Record<string, string[]> = {
  sichuan: ["sichuan", "四川", "川菜", "麻辣", "辣", "花椒"],
  cantonese: ["cantonese", "粤菜", "广东", "广式", "粤"],
  hunan: ["hunan", "湖南", "湘菜"],
  shandong: ["shandong", "山东", "鲁菜"],
  jiangsu: ["jiangsu", "江苏", "苏菜", "淮扬"],
  zhejiang: ["zhejiang", "浙江", "浙菜"],
  fujian: ["fujian", "福建", "闽菜"],
  anhui: ["anhui", "安徽", "徽菜"],
  henan: ["henan", "河南", "豫菜"],
  northeast: ["northeast", "东北", "东北菜"],
  hubei: ["hubei", "湖北", "鄂菜"],
  xinjiang: ["xinjiang", "新疆", "清真"],
  yunnan: ["yunnan", "云南", "滇菜"],
}

const REGION_KEYWORDS: Record<string, string[]> = {
  beijing: ["beijing", "北京"],
  shanghai: ["shanghai", "上海"],
  guangzhou: ["guangzhou", "广州", "深圳"],
  chengdu: ["chengdu", "成都"],
  chongqing: ["chongqing", "重庆"],
}

const TOPIC_KEYWORDS: Record<string, string[]> = {
  pairing: ["pair", "搭配", "配", "适合", "goes with"],
  usage: ["use", "怎么用", "如何用", "做法", "烹饪"],
  selling_point: ["sell", "推销", "卖点", "优势", "好处"],
  price: ["price", "价格", "多少钱", "成本", "利润"],
  competitor: ["competitor", "竞品", "对比", "区别"],
}

// ============================================================
// Memory Extraction Functions
// ============================================================

/**
 * Extract sauces mentioned in text
 */
export function extractSaucesFromText(text: string): string[] {
  const textLower = text.toLowerCase()
  const found: string[] = []

  for (const [sauce, keywords] of Object.entries(SAUCE_KEYWORDS)) {
    if (keywords.some((k) => textLower.includes(k.toLowerCase()))) {
      found.push(sauce)
    }
  }

  return found
}

/**
 * Extract cuisine preferences from text
 */
export function extractCuisinesFromText(text: string): string[] {
  const textLower = text.toLowerCase()
  const found: string[] = []

  for (const [cuisine, keywords] of Object.entries(CUISINE_KEYWORDS)) {
    if (keywords.some((k) => textLower.includes(k.toLowerCase()))) {
      found.push(cuisine)
    }
  }

  return found
}

/**
 * Extract region from text
 */
export function extractRegionFromText(text: string): string | null {
  const textLower = text.toLowerCase()

  for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (keywords.some((k) => textLower.includes(k.toLowerCase()))) {
      return region
    }
  }

  return null
}

/**
 * Extract topic from text
 */
export function extractTopicFromText(text: string): string {
  const textLower = text.toLowerCase()

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((k) => textLower.includes(k.toLowerCase()))) {
      return topic
    }
  }

  return "general"
}

// ============================================================
// Memory Storage Functions
// ============================================================

/**
 * Store product knowledge memory (sauces learned)
 */
export async function storeProductKnowledge(
  userId: string,
  message: string,
  aiResponse: string
): Promise<void> {
  // Extract sauces from both user message and AI response
  const combinedText = message + " " + aiResponse
  const sauces = extractSaucesFromText(combinedText)

  for (const sauceName of sauces) {
    const sauce = sauceKnowledgeBase.find(
      (s) => s.name === sauceName || s.nameZh === sauceName
    )

    if (!sauce) continue

    const topic = extractTopicFromText(combinedText)
    const content = `Learned about ${sauce.name} (${sauce.nameZh})`

    // Upsert to avoid duplicates
    const existing = await prisma.userMemory.findFirst({
      where: {
        userId,
        memoryType: "knowledge",
        content,
      },
    })

    if (existing) {
      // Update last practiced time
      await prisma.userMemory.update({
        where: { id: existing.id },
        data: {
          metadata: {
            ...(existing.metadata as Record<string, unknown>),
            lastPracticed: new Date().toISOString(),
            practiceCount: ((existing.metadata as Record<string, unknown>)?.practiceCount as number || 0) + 1,
          },
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new memory
      await prisma.userMemory.create({
        data: {
          userId,
          memoryType: "knowledge",
          content,
          metadata: {
            sauceId: sauce.id,
            sauceName: sauce.name,
            sauceNameZh: sauce.nameZh,
            topic,
            depth: "basic",
            lastPracticed: new Date().toISOString(),
            practiceCount: 1,
          },
        },
      })
    }
  }
}

/**
 * Store preference memory (cuisine, region preferences)
 */
export async function storePreferences(
  userId: string,
  message: string
): Promise<void> {
  // Extract cuisine preferences
  const cuisines = extractCuisinesFromText(message)
  for (const cuisine of cuisines) {
    await upsertPreference(userId, "cuisine", cuisine, 0.6)
  }

  // Extract region preferences
  const region = extractRegionFromText(message)
  if (region) {
    await upsertPreference(userId, "region", region, 0.6)
  }
}

/**
 * Helper: Upsert a preference memory with confidence scoring
 */
async function upsertPreference(
  userId: string,
  category: string,
  value: string,
  confidenceIncrement: number
): Promise<void> {
  const content = `Prefers ${category}: ${value}`

  const existing = await prisma.userMemory.findFirst({
    where: {
      userId,
      memoryType: "preference",
      content,
    },
  })

  if (existing) {
    // Increase confidence (cap at 1.0)
    const currentConfidence =
      (existing.metadata as Record<string, unknown>)?.confidence as number || 0.5
    const newConfidence = Math.min(1.0, currentConfidence + confidenceIncrement)

    await prisma.userMemory.update({
      where: { id: existing.id },
      data: {
        metadata: {
          ...(existing.metadata as Record<string, unknown>),
          confidence: newConfidence,
          lastSeen: new Date().toISOString(),
        },
        updatedAt: new Date(),
      },
    })
  } else {
    // Create new preference
    await prisma.userMemory.create({
      data: {
        userId,
        memoryType: "preference",
        content,
        metadata: {
          category,
          value,
          confidence: confidenceIncrement,
          source: "inferred",
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
        },
      },
    })
  }
}

// ============================================================
// Memory Retrieval Functions
// ============================================================

/**
 * Build memory context for AI prompt
 */
export async function buildMemoryContext(
  userId: string
): Promise<MemoryContext> {
  const [user, knowledgeMemories, preferenceMemories] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userMemory.findMany({
      where: { userId, memoryType: "knowledge" },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    prisma.userMemory.findMany({
      where: { userId, memoryType: "preference" },
      orderBy: { metadata: { confidence: "desc" } },
    }),
  ])

  // Extract known sauces
  const knownSauces = knowledgeMemories
    .map((m) => (m.metadata as Record<string, unknown>)?.sauceName as string)
    .filter(Boolean)

  // Extract recent topics
  const recentTopics = knowledgeMemories
    .slice(0, 5)
    .map((m) => m.content)

  // Extract preferences
  const preferences = preferenceMemories
    .filter((m) => {
      const meta = m.metadata as Record<string, unknown>
      return (meta?.confidence as number || 0) >= 0.5
    })
    .map((m) => ({
      content: m.content,
      confidence: (m.metadata as Record<string, unknown>)?.confidence as number || 0,
    }))

  return {
    userProfile: {
      name: user?.name,
      experience: user?.experience,
      preferences: user?.preferences as { cuisine?: string[]; region?: string[] } | null,
    },
    knownSauces,
    recentTopics,
    preferences,
  }
}

/**
 * Get knowledge context for AI prompt
 */
export async function getKnowledgeContext(userId: string): Promise<string> {
  const context = await buildMemoryContext(userId)

  if (context.knownSauces.length === 0 && context.preferences.length === 0) {
    return ""
  }

  let prompt = "\n\n## User Memory Context\n"

  if (context.knownSauces.length > 0) {
    prompt += `\nAlready learned sauces: ${[...new Set(context.knownSauces)].join(", ")}`
    prompt += "\nInstructions: Don't repeat basic info they already know. Build on previously learned concepts."
  }

  if (context.preferences.length > 0) {
    prompt += "\n\nUser Preferences:"
    context.preferences.forEach((p) => {
      prompt += `\n- ${p.content} (confidence: ${(p.confidence * 100).toFixed(0)}%)`
    })
    prompt += "\nInstructions: Prioritize content matching these preferences."
  }

  return prompt
}

/**
 * Get preference context for AI prompt
 */
export async function getPreferenceContext(userId: string): Promise<string> {
  const preferences = await prisma.userMemory.findMany({
    where: {
      userId,
      memoryType: "preference",
    },
    orderBy: { metadata: { confidence: "desc" } },
  })

  if (preferences.length === 0) {
    return ""
  }

  let prompt = "\n\nUser Focus Areas:"
  preferences.forEach((p) => {
    const meta = p.metadata as Record<string, unknown>
    const confidence = (meta?.confidence as number || 0) * 100
    prompt += `\n- ${p.content} (${confidence.toFixed(0)}% confidence)`
  })

  return prompt
}
