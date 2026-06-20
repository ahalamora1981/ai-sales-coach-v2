// KHC 酱料知识库 - 详细知识点
export interface SauceKnowledge {
  id: string
  name: string
  nameZh: string
  category: string
  categoryZh: string
  description: string
  keyFeatures: string[]
  usageMethods: string[]
  storageTips: string
  shelfLife: string
  bestPairings: string[]
  relatedCuisines: string[]
  proTips: string[]
}

export interface CuisineKnowledge {
  id: string
  name: string
  nameZh: string
  region: string
  characteristics: string
  flavorProfile: string
  keyIngredients: string[]
  signatureDishes: string[]
  sauceRecommendations: string[]
  cookingTechniques: string[]
}

export const sauceKnowledgeBase: SauceKnowledge[] = [
  {
    id: "chili-garlic",
    name: "Chili Garlic Sauce",
    nameZh: "蒜蓉辣酱",
    category: "chili",
    categoryZh: "辣酱类",
    description: "蒜香浓郁的多功能辣酱，适用于炒菜、蘸酱和腌制。",
    keyFeatures: ["蒜香突出", "辣度中等", "质地粗粒", "用途广泛"],
    usageMethods: [
      "炒菜时加入，增添蒜香和辣味",
      "与酱油混合制成快速蘸酱",
      "作为腌料基础，适合肉类"
    ],
    storageTips: "开封后冷藏保存，使用干净餐具取用",
    shelfLife: "开封后冷藏可保存3个月",
    bestPairings: ["宫保鸡丁", "麻婆豆腐", "炒饭", "炒面"],
    relatedCuisines: ["川菜", "粤菜", "东南亚菜"],
    proTips: [
      "炒菜时先爆香蒜蓉辣酱，再加入主料",
      "可与蜂蜜混合做成甜辣烤肉酱",
      "拌面时加入少许，增添风味"
    ]
  },
  {
    id: "sriracha",
    name: "Sriracha",
    nameZh: "是拉差辣酱",
    category: "chili",
    categoryZh: "辣酱类",
    description: "顺滑微甜的辣酱，带蒜香，全球流行。",
    keyFeatures: ["口感顺滑", "微甜", "蒜香", "辣度温和"],
    usageMethods: [
      "作为 finishing sauce 淋在菜品上",
      "拌入蛋黄酱制成辣味aioli",
      "搭配早餐蛋类"
    ],
    storageTips: "常温保存即可，开封后风味更佳",
    shelfLife: "未开封可保存2年，开封后6个月",
    bestPairings: ["春卷", "越南河粉", "汉堡", "炸鸡"],
    relatedCuisines: ["东南亚菜", "美式"],
    proTips: [
      "薯条蘸酱首选",
      "拌入意面酱增添辣味",
      "披萨淋酱效果绝佳"
    ]
  },
  {
    id: "sambal-oelek",
    name: "Sambal Oelek",
    nameZh: "叁巴酱",
    category: "chili",
    categoryZh: "辣酱类",
    description: "传统印尼辣椒酱，纯正辣味，质地粗糙。",
    keyFeatures: ["纯正辣味", "粗粒质地", "无添加糖", "传统风味"],
    usageMethods: [
      "作为咖喱底料",
      "加入汤品增辣",
      "与青柠汁混合制成酸辣蘸酱"
    ],
    storageTips: "必须冷藏保存，取用时使用干燥餐具",
    shelfLife: "开封后冷藏可保存2个月",
    bestPairings: ["沙爹", "炒粿条", "椰浆饭", "叻沙"],
    relatedCuisines: ["印尼菜", "马来菜", "新加坡菜"],
    proTips: [
      "炒饭时加入一勺，风味地道",
      "腌制鸡肉后烤制，味道绝佳",
      "与椰奶混合可降低辣度"
    ]
  },
  {
    id: "premium-soy",
    name: "Premium Soy Sauce",
    nameZh: "生抽",
    category: "soy",
    categoryZh: "酱油类",
    description: "优质生抽，调味蘸食皆宜，鲜味浓郁。",
    keyFeatures: ["鲜味浓郁", "色泽浅", "咸度适中", "提鲜必备"],
    usageMethods: [
      "出锅前加入保留鲜味",
      "作为蘸酱基础",
      "腌制食材提鲜"
    ],
    storageTips: "常温避光保存，开封后风味更佳",
    shelfLife: "未开封可保存3年，开封后1年",
    bestPairings: ["蒸鱼", "炒青菜", "饺子", "白切鸡"],
    relatedCuisines: ["粤菜", "鲁菜", "本帮菜"],
    proTips: [
      "蒸鱼豉油=生抽+少许糖+姜丝",
      "凉拌菜最后淋入，保持色泽",
      "炒菜时锅边淋入更香"
    ]
  },
  {
    id: "mushroom-soy",
    name: "Mushroom Soy Sauce",
    nameZh: "草菇酱油",
    category: "soy",
    categoryZh: "酱油类",
    description: "加入草菇提取物的深色酱油，增色提鲜。",
    keyFeatures: ["色泽深", "草菇鲜香", "增色效果好", "鲜味复合"],
    usageMethods: [
      "红烧菜肴上色",
      "炒饭增色",
      "卤味调色"
    ],
    storageTips: "常温避光保存",
    shelfLife: "未开封可保存2年",
    bestPairings: ["红烧肉", "炒面", "卤味", "焖饭"],
    relatedCuisines: ["鲁菜", "本帮菜"],
    proTips: [
      "红烧菜必备，色泽诱人",
      "与生抽1:1混合，色香味俱全",
      "炒饭时少许即可上色"
    ]
  },
  {
    id: "classic-oyster",
    name: "Classic Oyster Sauce",
    nameZh: "蚝油",
    category: "oyster",
    categoryZh: "蚝油类",
    description: "蚝汁提取的浓郁鲜酱，粤菜必备。",
    keyFeatures: ["蚝香浓郁", "质地浓稠", "提鲜增香", "粤菜灵魂"],
    usageMethods: [
      "肉类上光提亮",
      "炒菜增鲜",
      "淋在蒸菜上"
    ],
    storageTips: "开封后必须冷藏保存",
    shelfLife: "开封后冷藏可保存6个月",
    bestPairings: ["蚝油生菜", "炒牛肉", "叉烧", "西兰花"],
    relatedCuisines: ["粤菜"],
    proTips: [
      "蚝油生菜=蚝油+蒜蓉+少许糖",
      "腌制牛肉时加入，肉质嫩滑",
      "最后加入，避免高温破坏鲜味"
    ]
  },
  {
    id: "mushroom-oyster",
    name: "Mushroom Oyster Sauce",
    nameZh: "素蚝油",
    category: "oyster",
    categoryZh: "蚝油类",
    description: "蘑菇制作的素食蚝油，风味相近，植物基。",
    keyFeatures: ["素食可选", "蘑菇鲜香", "无海鲜", "用途相同"],
    usageMethods: ["与蚝油相同用法", "素食炒菜必备", "拌面调味"],
    storageTips: "开封后冷藏保存",
    shelfLife: "开封后冷藏可保存4个月",
    bestPairings: ["素炒", "豆腐", "炒饭", "蒸蔬菜"],
    relatedCuisines: ["素食", "粤菜"],
    proTips: [
      "对海鲜过敏者的完美替代",
      "素食红烧菜上色效果好",
      "拌面时加入，增添鲜味"
    ]
  },
  {
    id: "hoisin",
    name: "Hoisin Sauce",
    nameZh: "海鲜酱",
    category: "hoisin",
    categoryZh: "酱料类",
    description: "甜咸适中，五香风味，北京烤鸭必备。",
    keyFeatures: ["甜咸", "五香味", "浓稠", "烤鸭标配"],
    usageMethods: [
      "烤鸭卷饼必备",
      "肉类上光",
      "春卷蘸酱"
    ],
    storageTips: "开封后冷藏保存",
    shelfLife: "开封后冷藏可保存6个月",
    bestPairings: ["北京烤鸭", "春卷", "锅贴", "叉烧"],
    relatedCuisines: ["京菜", "粤菜"],
    proTips: [
      "烤鸭薄饼+海鲜酱+葱丝+黄瓜=经典吃法",
      "可作为烤肉腌料基础",
      "与蒜蓉混合做蘸酱"
    ]
  },
  {
    id: "chinese-bbq",
    name: "Chinese BBQ Sauce",
    nameZh: "烧烤酱",
    category: "hoisin",
    categoryZh: "酱料类",
    description: "甜腻适中的烧烤酱，广式叉烧风味。",
    keyFeatures: ["甜腻", "叉烧风味", "上色效果好", "烧烤必备"],
    usageMethods: [
      "腌制肉类至少2小时",
      "烧烤时刷酱增亮",
      "与蜂蜜混合增甜"
    ],
    storageTips: "开封后冷藏保存",
    shelfLife: "开封后冷藏可保存3个月",
    bestPairings: ["叉烧", "烤肉", "烧鸭", "烤排骨"],
    relatedCuisines: ["粤菜", "烧烤"],
    proTips: [
      "叉烧腌制过夜更入味",
      "最后5分钟刷酱，避免烤焦",
      "加少许蜂蜜，色泽更亮"
    ]
  },
  {
    id: "doubanjiang",
    name: "Doubanjiang",
    nameZh: "豆瓣酱",
    category: "specialty",
    categoryZh: "特色酱料",
    description: "四川发酵辣椒酱，'川菜之魂'。",
    keyFeatures: ["发酵风味", "辣度高", "咸鲜", "川菜灵魂"],
    usageMethods: [
      "油炒出红油再加主料",
      "作为川菜底料",
      "少量使用，味道浓郁"
    ],
    storageTips: "开封后冷藏保存，表面可淋少许油防干",
    shelfLife: "开封后冷藏可保存1年",
    bestPairings: ["麻婆豆腐", "回锅肉", "水煮鱼", "宫保鸡丁"],
    relatedCuisines: ["川菜"],
    proTips: [
      "小火慢炒出红油，香味更浓",
      "新手从半勺开始，逐步加量",
      "与甜面酱混合，降低辣度"
    ]
  },
  {
    id: "fermented-black-bean",
    name: "Fermented Black Bean",
    nameZh: "豆豉",
    category: "specialty",
    categoryZh: "特色酱料",
    description: "发酵黑豆，咸鲜浓郁，粤菜经典。",
    keyFeatures: ["发酵鲜味", "咸度高", "颗粒感", "粤菜经典"],
    usageMethods: [
      "使用前冲洗降低盐分",
      "压碎释放更浓香味",
      "与蒜蓉同炒更香"
    ],
    storageTips: "密封保存，可冷冻延长保质期",
    shelfLife: "密封可保存2年",
    bestPairings: ["豆豉鲮鱼", "排骨", "炒青菜", "蒸鱼"],
    relatedCuisines: ["粤菜"],
    proTips: [
      "豆豉蒸排骨=经典粤菜",
      "与蒜蓉1:1混合，炒菜万能酱",
      "炒青菜时加入，风味独特"
    ]
  },
  {
    id: "sweet-chili",
    name: "Sweet Chili Sauce",
    nameZh: "甜辣酱",
    category: "specialty",
    categoryZh: "特色酱料",
    description: "甜辣适中，酸甜可口，亚洲流行蘸酱。",
    keyFeatures: ["甜辣", "酸甜", "温和", "蘸食首选"],
    usageMethods: [
      "油炸食品蘸酱",
      "鸡翅上光",
      "与是拉差混合增辣"
    ],
    storageTips: "常温保存即可",
    shelfLife: "未开封可保存18个月",
    bestPairings: ["炸虾", "春卷", "鸡块", "虾饼"],
    relatedCuisines: ["东南亚菜", "美式"],
    proTips: [
      "炸春卷蘸酱首选",
      "烤鸡翅最后5分钟刷酱",
      "拌沙拉增添甜辣风味"
    ]
  }
]

export const cuisineKnowledgeBase: CuisineKnowledge[] = [
  {
    id: "sichuan",
    name: "Sichuan Cuisine",
    nameZh: "川菜",
    region: "四川、重庆",
    characteristics: "一菜一格，百菜百味，麻辣鲜香。",
    flavorProfile: "麻辣、鱼香、怪味、椒麻、红油",
    keyIngredients: ["花椒", "辣椒", "豆瓣酱", "泡椒", "姜蒜"],
    signatureDishes: ["麻婆豆腐", "回锅肉", "宫保鸡丁", "水煮鱼", "夫妻肺片"],
    sauceRecommendations: ["豆瓣酱", "蒜蓉辣酱", "花椒油"],
    cookingTechniques: ["小炒", "干煸", "火锅", "蒸", "烧"]
  },
  {
    id: "cantonese",
    name: "Cantonese Cuisine",
    nameZh: "粤菜",
    region: "广东、广西、香港",
    characteristics: "清淡鲜美，注重原味，选料讲究。",
    flavorProfile: "清淡、鲜甜、咸鲜、蒜香",
    keyIngredients: ["蚝油", "生抽", "蒜蓉", "豆豉", "姜葱"],
    signatureDishes: ["白切鸡", "烧鹅", "蒸鱼", "叉烧", "煲仔饭"],
    sauceRecommendations: ["蚝油", "生抽", "草菇酱油", "豆豉"],
    cookingTechniques: ["蒸", "炒", "烤", "煲", "白灼"]
  },
  {
    id: "shandong",
    name: "Shandong Cuisine",
    nameZh: "鲁菜",
    region: "山东、华北",
    characteristics: "咸鲜为主，注重火候，大气豪放。",
    flavorProfile: "咸鲜、葱香、酱香",
    keyIngredients: ["大葱", "大蒜", "酱油", "醋", "料酒"],
    signatureDishes: ["糖醋鲤鱼", "九转大肠", "葱烧海参", "锅包肉"],
    sauceRecommendations: ["生抽", "老抽", "甜面酱"],
    cookingTechniques: ["爆", "炒", "烧", "塌", "蒸"]
  },
  {
    id: "jiangsu",
    name: "Jiangsu Cuisine",
    nameZh: "苏菜",
    region: "江苏、浙江",
    characteristics: "甜糯软烂，精致典雅，注重刀工。",
    flavorProfile: "甜咸、清鲜、本味",
    keyIngredients: ["糖", "醋", "酱油", "料酒", "姜"],
    signatureDishes: ["松鼠桂鱼", "狮子头", "盐水鸭", "叫花鸡"],
    sauceRecommendations: ["生抽", "蚝油", "甜辣酱"],
    cookingTechniques: ["炖", "焖", "蒸", "烧", "煨"]
  }
]

export const categoryNames: Record<string, string> = {
  chili: "辣酱类",
  soy: "酱油类",
  oyster: "蚝油类",
  hoisin: "酱料类",
  specialty: "特色酱料"
}
