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
  western: ["western", "西餐", "西式", "牛排", "意面", "披萨", "沙拉"],
  japanese: ["japanese", "日餐", "日式", "日料", "寿司", "刺身"],
  korean: ["korean", "韩餐", "韩式", "韩国", "烤肉"],
  southeast_asian: ["thai", "越南", "东南亚", "泰餐"],
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
      orderBy: { updatedAt: "desc" },
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

  // Extract preferences (sort by confidence manually)
  const preferences = preferenceMemories
    .filter((m) => {
      const meta = m.metadata as Record<string, unknown>
      return (meta?.confidence as number || 0) >= 0.5
    })
    .sort((a, b) => {
      const confA = (a.metadata as Record<string, unknown>)?.confidence as number || 0
      const confB = (b.metadata as Record<string, unknown>)?.confidence as number || 0
      return confB - confA
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
    prompt += `\nAlready learned sauces: ${Array.from(new Set(context.knownSauces)).join(", ")}`
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
    orderBy: { updatedAt: "desc" },
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

// ============================================================
// Restaurant Memory
// ============================================================

/**
 * Store restaurant memory from menu scan
 */
export async function storeRestaurantMemory(
  userId: string,
  scanResult: {
    restaurantName?: string
    dishes: Array<{
      originalName: string
      englishName?: string
      recommendations: Array<{ sauce: string; reason: string }>
    }>
  }
): Promise<void> {
  // Generate a unique restaurant name with timestamp if not provided
  const restaurantName = scanResult.restaurantName || `Menu Scan ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
  
  // Extract all sauce names from recommendations
  const saucesPitched = Array.from(new Set(
    scanResult.dishes.flatMap((d) => d.recommendations.map((r) => r.sauce))
  ))
  
  // Extract all dish names
  const dishesScanned = scanResult.dishes.map((d) => d.originalName)
  
  // Detect cuisine type from dishes
  const combinedDishText = dishesScanned.join(" ")
  const cuisines = extractCuisinesFromText(combinedDishText)
  const cuisineType = cuisines.length > 0 ? cuisines[0] : "general"

  const content = `Scanned ${restaurantName}`
  
  // Check if we already have a memory for this restaurant
  const existing = await prisma.userMemory.findFirst({
    where: {
      userId,
      memoryType: "restaurant",
      content,
    },
  })

  if (existing) {
    // Update existing restaurant memory
    const existingMeta = existing.metadata as Record<string, unknown>
    const existingDishes = (existingMeta?.dishesScanned as string[]) || []
    const existingSauces = (existingMeta?.saucesPitched as string[]) || []
    
    await prisma.userMemory.update({
      where: { id: existing.id },
      data: {
        metadata: {
          ...existingMeta,
          dishesScanned: Array.from(new Set([...existingDishes, ...dishesScanned])),
          saucesPitched: Array.from(new Set([...existingSauces, ...saucesPitched])),
          scanCount: ((existingMeta?.scanCount as number) || 1) + 1,
          lastScan: new Date().toISOString(),
        },
        updatedAt: new Date(),
      },
    })
  } else {
    // Create new restaurant memory
    await prisma.userMemory.create({
      data: {
        userId,
        memoryType: "restaurant",
        content,
        metadata: {
          restaurantName,
          cuisineType,
          dishesScanned,
          saucesPitched,
          scanCount: 1,
          firstScan: new Date().toISOString(),
          lastScan: new Date().toISOString(),
          outcome: "pending",
        },
      },
    })
  }
}

/**
 * Get restaurant context for AI prompt
 */
export async function getRestaurantContext(
  userId: string,
  currentDishes?: string[]
): Promise<string> {
  const restaurants = await prisma.userMemory.findMany({
    where: {
      userId,
      memoryType: "restaurant",
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  })

  if (restaurants.length === 0) {
    return ""
  }

  let prompt = "\n\n## Restaurant Visit History"
  
  // Check if current dishes match any previous restaurant
  if (currentDishes && currentDishes.length > 0) {
    const currentText = currentDishes.join(" ").toLowerCase()
    
    for (const restaurant of restaurants) {
      const meta = restaurant.metadata as Record<string, unknown>
      const dishesScanned = (meta?.dishesScanned as string[]) || []
      
      // Check for overlapping dishes
      const overlap = dishesScanned.filter((d) =>
        currentText.includes(d.toLowerCase())
      )
      
      if (overlap.length > 0) {
        prompt += "\n\n### Previous Visit Detected"
        prompt += `\nRestaurant: ${meta.restaurantName}`
        prompt += `\nPreviously scanned dishes: ${dishesScanned.join(", ")}`
        prompt += `\nSauces previously recommended: ${(meta?.saucesPitched as string[])?.join(", ")}`
        prompt += `\nVisit count: ${meta.scanCount}`
        prompt += "\nInstructions: Reference this previous visit. Ask about follow-up or new recommendations."
        break
      }
    }
  }
  
  // Show recent restaurants
  prompt += "\n\nRecent restaurants visited:"
  restaurants.slice(0, 5).forEach((r) => {
    const meta = r.metadata as Record<string, unknown>
    const scanCount = (meta?.scanCount as number) || 1
    prompt += `\n- ${meta.restaurantName} (${meta.cuisineType}) - ${scanCount} visit(s)`
  })

  return prompt
}

/**
 * Get all restaurant memories for a user (for UI display)
 */
export async function getRestaurantMemories(userId: string) {
  return prisma.userMemory.findMany({
    where: {
      userId,
      memoryType: "restaurant",
    },
    orderBy: { updatedAt: "desc" },
  })
}

// ============================================================
// Sales Scenario Memory
// ============================================================

/**
 * Scenario types
 */
export type ScenarioType = 
  | "objection_price"     // Price objection handling
  | "objection_quality"   // Quality objection handling
  | "objection_competition" // Competitor comparison
  | "pitch"               // Sales pitch practice
  | "closing"             // Closing techniques
  | "product_knowledge"   // Product knowledge quiz
  | "general"             // General sales conversation

/**
 * Detect scenario type from conversation
 */
export function detectScenarioType(text: string): ScenarioType {
  const textLower = text.toLowerCase()
  
  // Price objections
  if (textLower.match(/price|价格|多少钱|贵|便宜|成本|利润|margin/)) {
    return "objection_price"
  }
  
  // Quality objections
  if (textLower.match(/quality|质量|味道|口感|不好吃|差/)) {
    return "objection_quality"
  }
  
  // Competition
  if (textLower.match(/competitor|竞品|对比|区别|其他品牌|李锦记|海天/)) {
    return "objection_competition"
  }
  
  // Pitch
  if (textLower.match(/pitch|推销|介绍|卖|怎么卖|话术/)) {
    return "pitch"
  }
  
  // Closing
  if (textLower.match(/close|成交|签单|下单|合作|签/)) {
    return "closing"
  }
  
  // Product knowledge
  if (textLower.match(/what is|是什么|怎么用|用法|做法|成分|原料/)) {
    return "product_knowledge"
  }
  
  return "general"
}

/**
 * Detect struggle from thumbs down or negative feedback
 */
export function detectStruggle(
  userMessage: string,
  aiResponse: string,
  feedback: string
): {
  isStruggle: boolean
  strugglePoints: string[]
} {
  if (feedback !== "thumbs_down") {
    return { isStruggle: false, strugglePoints: [] }
  }
  
  const strugglePoints: string[] = []
  const combinedText = userMessage + " " + aiResponse
  
  // Detect what they struggled with
  if (combinedText.match(/price|价格/)) strugglePoints.push("price_handling")
  if (combinedText.match(/quality|质量/)) strugglePoints.push("quality_objection")
  if (combinedText.match(/competitor|竞品/)) strugglePoints.push("competitor_comparison")
  if (combinedText.match(/closing|成交/)) strugglePoints.push("closing_technique")
  
  return {
    isStruggle: true,
    strugglePoints: strugglePoints.length > 0 ? strugglePoints : ["general"],
  }
}

/**
 * Store knowledge point from thumbs up
 */
export async function storeKnowledgePoint(
  userId: string,
  conversationId: string,
  aiResponse: string
): Promise<void> {
  // Extract key knowledge point from AI response
  let knowledgePoint = ""
  
  // Try to find sales tips or key insights with patterns
  const patterns = [
    /话术[：:][\s]*["](.+?)["]/,
    /建议[：:][\s]*["](.+?)["]/,
    /可以强调[：:][\s]*(.+?)[。，]/,
    /关键是[：:][\s]*(.+?)[。，]/,
    /核心卖点[：:][\s]*(.+?)[。，]/,
    /记住[：:][\s]*(.+?)[。，]/,
  ]
  
  for (const pattern of patterns) {
    const match = aiResponse.match(pattern)
    if (match && match[1]) {
      knowledgePoint = match[1].trim()
      break
    }
  }
  
  // Fallback: find sentence about sauce/product
  if (!knowledgePoint) {
    const sentences = aiResponse.split(/[。！？]/)
    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      if (trimmed.length > 15 && trimmed.length < 80 && 
          (trimmed.includes("酱") || trimmed.includes("KHC") || 
           trimmed.includes("搭配") || trimmed.includes("适合") ||
           trimmed.includes("卖点") || trimmed.includes("风味"))) {
        knowledgePoint = trimmed
        break
      }
    }
  }
  
  // Final fallback
  if (!knowledgePoint) {
    knowledgePoint = aiResponse.substring(0, 60).trim()
  }
  
  // Clean up
  knowledgePoint = knowledgePoint
    .replace(/^[，,、\s]+/, '')
    .replace(/[，,\s]+$/, '')
    .trim()

  // Check for exact duplicates only (last 5 knowledge points)
  const recentPoints = await prisma.userMemory.findMany({
    where: {
      userId,
      memoryType: "knowledge_point",
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  // Avoid exact duplicates
  const isDuplicate = recentPoints.some(p => {
    const existingContent = p.content.toLowerCase()
    const newContent = knowledgePoint.toLowerCase()
    return existingContent === newContent
  })

  if (isDuplicate) {
    return // Skip exact duplicates
  }

  await prisma.userMemory.create({
    data: {
      userId,
      memoryType: "knowledge_point",
      content: knowledgePoint,
      metadata: {
        conversationId,
        originalResponse: aiResponse.slice(0, 500),
        learnedAt: new Date().toISOString(),
      },
    },
  })
}

/**
 * Get knowledge points for display
 */
export async function getKnowledgePoints(userId: string) {
  return prisma.userMemory.findMany({
    where: {
      userId,
      memoryType: "knowledge_point",
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })
}

/**
 * Get scenario context for AI prompt
 */
export async function getScenarioContext(userId: string): Promise<string> {
  const scenarios = await prisma.userMemory.findMany({
    where: {
      userId,
      memoryType: "scenario",
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  })

  if (scenarios.length === 0) {
    return ""
  }

  // Separate struggles and successes
  const struggles = scenarios.filter(
    (s) => (s.metadata as Record<string, unknown>)?.outcome === "struggle"
  )
  const successes = scenarios.filter(
    (s) => (s.metadata as Record<string, unknown>)?.outcome === "success"
  )
  
  let prompt = "\n\n## Sales Practice History"
  
  if (struggles.length > 0) {
    prompt += "\n\n### Areas Needing Improvement"
    struggles.slice(0, 5).forEach((s) => {
      const meta = s.metadata as Record<string, unknown>
      prompt += `\n- ${meta.scenarioType}: ${s.content} (practiced ${meta.practiceCount} times)`
    })
    prompt += "\nInstructions: Focus practice on these weak areas. Provide extra tips and encouragement."
  }
  
  if (successes.length > 0) {
    prompt += "\n\n### Strengths"
    successes.slice(0, 3).forEach((s) => {
      const meta = s.metadata as Record<string, unknown>
      prompt += `\n- ${meta.scenarioType}: ${s.content} (practiced ${meta.practiceCount} times)`
    })
    prompt += "\nInstructions: Acknowledge their strengths. Suggest more advanced challenges."
  }

  return prompt
}

/**
 * Get scenario memories for a user (for UI display)
 */
export async function getScenarioMemories(userId: string) {
  return prisma.userMemory.findMany({
    where: {
      userId,
      memoryType: "scenario",
    },
    orderBy: { updatedAt: "desc" },
  })
}
