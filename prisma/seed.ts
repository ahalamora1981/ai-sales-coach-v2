import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean existing data
  await prisma.userMemory.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.sauceKB.deleteMany()
  await prisma.user.deleteMany()

  // === Create Demo Users ===
  const demoUsers = [
    {
      name: "小王 (Xiao Wang)",
      email: "wang@demo.com",
      password: await bcrypt.hash("demo123", 10),
      experience: "beginner",
      preferences: { cuisine: [], region: [] },
    },
    {
      name: "李姐 (Li Jie)",
      email: "li@demo.com",
      password: await bcrypt.hash("demo123", 10),
      experience: "intermediate",
      preferences: { cuisine: ["sichuan"], region: ["chengdu"] },
    },
    {
      name: "张总 (Zhang Zong)",
      email: "zhang@demo.com",
      password: await bcrypt.hash("demo123", 10),
      experience: "expert",
      preferences: { cuisine: ["hotpot"], region: ["beijing"] },
    },
  ]

  const users = []
  for (const userData of demoUsers) {
    const user = await prisma.user.create({ data: userData })
    users.push(user)
    console.log(`  ✓ Created user: ${user.name}`)
  }

  // === Create KHC Sauce Knowledge Base ===
  const sauces = [
    // Chili Sauces
    {
      name: "Chili Garlic Sauce",
      nameZh: "蒜蓉辣酱",
      description:
        "A versatile chili sauce with bold garlic flavor. Perfect for stir-fries, dipping sauces, and marinades.",
      category: "chili",
      pairingGuide: {
        cuisines: ["sichuan", "cantonese", "thai"],
        dishes: [
          "宫保鸡丁",
          "Kung Pao Chicken",
          "麻婆豆腐",
          "Mapo Tofu",
          "炒饭",
          "Fried Rice",
        ],
        tips: [
          "Add during cooking for heat and garlic flavor",
          "Mix with soy sauce for a quick dipping sauce",
          "Great base for spicy marinades",
        ],
      },
    },
    {
      name: "Sriracha",
      nameZh: "是拉差辣酱",
      description:
        "Smooth, slightly sweet chili sauce with garlic undertones. Popular worldwide.",
      category: "chili",
      pairingGuide: {
        cuisines: ["thai", "vietnamese", "american", "mexican"],
        dishes: [
          "春卷",
          "Spring Rolls",
          "越南河粉",
          "Pho",
          "汉堡",
          "Burgers",
        ],
        tips: [
          "Excellent as a finishing sauce",
          "Great for drizzling on eggs",
          "Mix with mayo for spicy aioli",
        ],
      },
    },
    {
      name: "Sambal Oelek",
      nameZh: "叁巴酱",
      description:
        "Traditional Indonesian chili paste. Pure chili heat with a coarse texture.",
      category: "chili",
      pairingGuide: {
        cuisines: ["indonesian", "malaysian", "singaporean"],
        dishes: [
          "沙爹",
          "Satay",
          "炒粿条",
          "Char Kway Teow",
          "椰浆饭",
          "Nasi Lemak",
        ],
        tips: [
          "Use as a cooking base for curries",
          "Add to soups for extra heat",
          "Mix with lime juice for a zesty condiment",
        ],
      },
    },
    // Soy Sauces
    {
      name: "Premium Soy Sauce",
      nameZh: "生抽",
      description:
        "Light soy sauce for seasoning and dipping. Brewed for rich umami flavor.",
      category: "soy",
      pairingGuide: {
        cuisines: ["chinese", "japanese", "korean"],
        dishes: [
          "蒸鱼",
          "Steamed Fish",
          "炒青菜",
          "Stir-fried Vegetables",
          "饺子",
          "Dumplings",
        ],
        tips: [
          "Add at the end of cooking to preserve flavor",
          "Use as a base for dipping sauces",
          "Essential for Cantonese steamed dishes",
        ],
      },
    },
    {
      name: "Mushroom Soy Sauce",
      nameZh: "草菇酱油",
      description:
        "Dark soy sauce infused with mushroom extract. Adds color and depth.",
      category: "soy",
      pairingGuide: {
        cuisines: ["chinese", "hongkong"],
        dishes: [
          "红烧肉",
          "Braised Pork Belly",
          "炒面",
          "Chow Mein",
          "卤味",
          "Braised Dishes",
        ],
        tips: [
          "Use for color in braised dishes",
          "Adds umami depth to fried rice",
          "Great for mushroom-based vegetarian dishes",
        ],
      },
    },
    // Oyster Sauces
    {
      name: "Classic Oyster Sauce",
      nameZh: "蚝油",
      description:
        "Rich, savory sauce made from oyster extracts. Essential in Cantonese cooking.",
      category: "oyster",
      pairingGuide: {
        cuisines: ["cantonese", "chinese"],
        dishes: [
          "蚝油生菜",
          "Oyster Sauce Lettuce",
          "炒牛肉",
          "Stir-fried Beef",
          "叉烧",
          "Char Siu",
        ],
        tips: [
          "Glaze for roasted meats",
          "Essential for beef and broccoli stir-fry",
          "Drizzle on steamed vegetables",
        ],
      },
    },
    {
      name: "Mushroom Oyster Sauce",
      nameZh: "素蚝油",
      description:
        "Vegetarian oyster sauce made from mushrooms. Same great flavor, plant-based.",
      category: "oyster",
      pairingGuide: {
        cuisines: ["vegetarian", "chinese"],
        dishes: [
          "素炒",
          "Vegetable Stir-fry",
          "豆腐",
          "Tofu Dishes",
          "炒饭",
          "Fried Rice",
        ],
        tips: [
          "Perfect for vegetarian dishes",
          "Use same as regular oyster sauce",
          "Great for those with shellfish allergies",
        ],
      },
    },
    // Hoisin/BBQ
    {
      name: "Hoisin Sauce",
      nameZh: "海鲜酱",
      description:
        "Sweet and savory sauce with five-spice notes. Perfect for Peking duck and wrapping.",
      category: "hoisin",
      pairingGuide: {
        cuisines: ["cantonese", "peking", "chinese"],
        dishes: [
          "北京烤鸭",
          "Peking Duck",
          "春卷",
          "Spring Rolls",
          "锅贴",
          "Potstickers",
        ],
        tips: [
          "Essential condiment for Peking duck wraps",
          "Use as a glaze for roasted meats",
          "Dipping sauce for spring rolls and dumplings",
        ],
      },
    },
    {
      name: "Chinese BBQ Sauce",
      nameZh: "烧烤酱",
      description:
        "Sweet and sticky sauce for grilling and roasting. Based on Cantonese char siu style.",
      category: "hoisin",
      pairingGuide: {
        cuisines: ["cantonese", "chinese", "bbq"],
        dishes: [
          "叉烧",
          "Char Siu",
          "烤肉",
          "BBQ Meat",
          "烧鸭",
          "Roast Duck",
        ],
        tips: [
          "Marinate meat for at least 2 hours",
          "Baste during grilling for glossy finish",
          "Mix with honey for extra sweetness",
        ],
      },
    },
    // Specialty
    {
      name: "Doubanjiang",
      nameZh: "豆瓣酱",
      description:
        "Fermented chili bean paste from Sichuan. The 'soul of Sichuan cuisine'.",
      category: "specialty",
      pairingGuide: {
        cuisines: ["sichuan"],
        dishes: [
          "麻婆豆腐",
          "Mapo Tofu",
          "回锅肉",
          "Twice-Cooked Pork",
          "水煮鱼",
          "Boiled Fish in Chili Sauce",
        ],
        tips: [
          "Fry in oil first to release aroma",
          "Essential base for Sichuan dishes",
          "Start with small amounts - it's potent",
        ],
      },
    },
    {
      name: "Fermented Black Bean",
      nameZh: "豆豉",
      description:
        "Fermented black soybeans with intense savory flavor. Classic in Cantonese cooking.",
      category: "specialty",
      pairingGuide: {
        cuisines: ["cantonese", "chinese"],
        dishes: [
          "豆豉鲮鱼",
          "Black Bean Fish",
          "排骨",
          "Spare Ribs",
          "炒青菜",
          "Stir-fried Greens",
        ],
        tips: [
          "Rinse before use to reduce saltiness",
          "Mash for stronger flavor release",
          "Pairs well with garlic and ginger",
        ],
      },
    },
    {
      name: "Sweet Chili Sauce",
      nameZh: "甜辣酱",
      description:
        "Mild, sweet chili sauce with tangy notes. Popular dipping sauce across Asia.",
      category: "specialty",
      pairingGuide: {
        cuisines: ["thai", "vietnamese", "chinese", "american"],
        dishes: [
          "炸虾",
          "Fried Shrimp",
          "春卷",
          "Spring Rolls",
          "鸡块",
          "Chicken Nuggets",
        ],
        tips: [
          "Perfect dipping sauce for fried foods",
          "Great as a glaze for wings",
          "Mix with sriracha for extra heat",
        ],
      },
    },
  ]

  for (const sauceData of sauces) {
    const sauce = await prisma.sauceKB.create({ data: sauceData })
    console.log(`  ✓ Created sauce: ${sauce.name} (${sauce.nameZh})`)
  }

  console.log("\n✅ Seeding complete!")
  console.log(`   - ${users.length} users created`)
  console.log(`   - ${sauces.length} sauces created`)
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
