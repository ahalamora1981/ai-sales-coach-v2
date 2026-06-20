export type Locale = "en" | "zh"

export interface Translations {
  appName: string
  appTagline: string
  loading: string
  error: string
  save: string
  cancel: string
  confirm: string
  back: string
  next: string
  send: string
  search: string
  noResults: string
  signIn: string
  signOut: string
  signingIn: string
  email: string
  password: string
  emailPlaceholder: string
  passwordPlaceholder: string
  invalidCredentials: string
  demoLoginHint: string
  demoPasswordHint: string
  demoPassword: string
  nav: {
    dashboard: string
    scanner: string
    aiCoach: string
    history: string
  }
  dashboard: {
    welcomeBack: string
    subtitle: string
    menuScanner: string
    menuScannerDesc: string
    startScanning: string
    aiSalesCoach: string
    aiSalesCoachDesc: string
    startChatting: string
    quickStart: string
    saucesCount: string
    inKnowledgeBase: string
    cuisinesCount: string
    cuisinesList: string
    adaptiveAi: string
    adaptiveAiDesc: string
    multiModel: string
    multiModelDesc: string
    recentActivity: string
    noActivity: string
  }
  scanner: {
    title: string
    subtitle: string
    visionNotice: string
    dropHere: string
    orClickToUpload: string
    chooseFile: string
    takePhoto: string
    clickToChange: string
    scanning: string
    scanMenu: string
    recognizedDishes: string
    selectImage: string
    failedToScan: string
    sampleImages: string
    sampleTexts: string
    menuPreview: string
    askCoach: string
    confidence: {
      high: string
      medium: string
      low: string
    }
  }
  chat: {
    title: string
    model: string
    greeting: string
    greetingDesc: string
    aiCoachLabel: string
    typeMessage: string
    failedToGetResponse: string
  }
  history: {
    title: string
    subtitle: string
    noHistory: string
    noHistoryDesc: string
    scanMenu: string
    startChatting: string
    untitled: string
    menuScan: string
    dishes: string
    chat: string
    messages: string
    justNow: string
    minutesAgo: string
    hoursAgo: string
    daysAgo: string
  }
  language: {
    en: string
    zh: string
  }
}

const en: Translations = {
  appName: "AI Coach",
  appTagline: "Kraft Heinz China",
  loading: "Loading...",
  error: "Error",
  save: "Save",
  cancel: "Cancel",
  confirm: "Confirm",
  back: "Back",
  next: "Next",
  send: "Send",
  search: "Search",
  noResults: "No results",
  signIn: "Sign In",
  signOut: "Sign Out",
  signingIn: "Signing in...",
  email: "Email",
  password: "Password",
  emailPlaceholder: "your@email.com",
  passwordPlaceholder: "••••••••",
  invalidCredentials: "Invalid email or password",
  demoLoginHint: "Quick login with demo accounts:",
  demoPasswordHint: "Demo password for all accounts:",
  demoPassword: "demo123",
  nav: {
    dashboard: "Dashboard",
    scanner: "Menu Scanner",
    aiCoach: "AI Coach",
    history: "History",
  },
  dashboard: {
    welcomeBack: "Welcome back",
    subtitle: "AI-powered coaching for KHC sauce products",
    menuScanner: "Menu Scanner",
    menuScannerDesc:
      "Upload a restaurant menu photo and let AI identify dishes with the best KHC sauce pairings.",
    startScanning: "Start Scanning →",
    aiSalesCoach: "AI Coach",
    aiSalesCoachDesc:
      "Chat with your AI coach for product knowledge, sales techniques, and personalized coaching.",
    startChatting: "Start Chatting →",
    quickStart: "Quick Start",
    recentActivity: "Recent Activity",
    noActivity:
      "No recent activity yet. Start by using Menu Scanner or chatting with your AI coach.",
    // Knowledge Base
    knowledgeBase: "Sauce Knowledge Base",
    knowledgeBaseDesc: "Kraft Heinz sauces and pairing recommendations",
    viewAllSauces: "View All Sauces →",
    categories: "categories",
    sauces: "sauces",
    // Usage Stats
    usageStats: "Usage Statistics",
    menuScans: "Menu Scans",
    chatSessions: "Chat Sessions",
    noData: "No data yet"
  },
  scanner: {
    title: "Menu Scanner",
    subtitle:
      "Upload a restaurant menu photo to get KHC sauce recommendations",
    visionNotice:
      "Menu Scanner uses Qwen (Vision AI model). DeepSeek does not support image analysis.",
    dropHere: "Drop menu image here",
    orClickToUpload: "or click to upload",
    chooseFile: "Choose File",
    takePhoto: "Take Photo",
    clickToChange: "Click to change image",
    scanning: "Scanning...",
    scanMenu: "Scan Menu",
    recognizedDishes: "Recognized Dishes",
    selectImage: "Please select an image file",
    failedToScan: "Failed to scan menu",
    sampleImages: "Sample Menu Images",
    sampleTexts: "Sample Text Menus",
    menuPreview: "Menu Content Preview",
    askCoach: "Ask Coach",
    confidence: {
      high: "high",
      medium: "medium",
      low: "low",
    },
  },
  chat: {
    title: "AI Sales Coach",
    model: "Model",
    greeting: "Hello! I'm your AI sales coach.",
    greetingDesc:
      "I can help you with product knowledge, sales techniques, and menu pairing advice for KHC sauces. What would you like to learn about today?",
    aiCoachLabel: "🤖 AI Coach",
    typeMessage: "Type your message...",
    failedToGetResponse: "Sorry, I encountered an error. Please try again.",
  },
  history: {
    title: "Conversation History",
    subtitle: "Your past conversations and menu scans",
    noHistory: "No history yet",
    noHistoryDesc:
      "Start by scanning a menu or chatting with your AI coach",
    scanMenu: "Scan Menu",
    startChatting: "Start Chatting",
    untitled: "Untitled Conversation",
    menuScan: "Menu scan",
    dishes: "dishes",
    chat: "Chat",
    messages: "messages",
    justNow: "Just now",
    minutesAgo: "m ago",
    hoursAgo: "h ago",
    daysAgo: "d ago",
  },
  language: {
    en: "English",
    zh: "中文",
  },
}

const zh: Translations = {
  appName: "AI 陪练",
  appTagline: "卡夫亨氏中国",
  loading: "加载中...",
  error: "错误",
  save: "保存",
  cancel: "取消",
  confirm: "确认",
  back: "返回",
  next: "下一步",
  send: "发送",
  search: "搜索",
  noResults: "无结果",
  signIn: "登录",
  signOut: "退出",
  signingIn: "登录中...",
  email: "邮箱",
  password: "密码",
  emailPlaceholder: "your@email.com",
  passwordPlaceholder: "••••••••",
  invalidCredentials: "邮箱或密码错误",
  demoLoginHint: "快速登录演示账号：",
  demoPasswordHint: "所有账号密码：",
  demoPassword: "demo123",
  nav: {
    dashboard: "主页",
    scanner: "菜单精灵",
    aiCoach: "专属陪练",
    history: "历史记录",
  },
  dashboard: {
    welcomeBack: "欢迎回来",
    subtitle: "KHC 酱料产品 AI 陪练",
    menuScanner: "菜单精灵",
    menuScannerDesc:
      "上传餐厅菜单照片，AI 识别菜品并推荐最适合的 KHC 酱料搭配。",
    startScanning: "开始扫描 →",
    aiSalesCoach: "AI 专属陪练",
    aiSalesCoachDesc:
      "与 AI 陪练对话，获取产品知识、销售技巧和个性化辅导。",
    startChatting: "开始聊天 →",
    quickStart: "快速开始",
    recentActivity: "最近活动",
    noActivity: "暂无活动记录。开始使用菜单精灵或与 AI 陪练聊天吧。",
    // 知识库
    knowledgeBase: "酱料知识库",
    knowledgeBaseDesc: "KHC 酱料产品及搭配推荐",
    viewAllSauces: "查看全部酱料 →",
    categories: "个分类",
    sauces: "款酱料",
    // 使用统计
    usageStats: "使用统计",
    menuScans: "菜单扫描",
    chatSessions: "陪练对话",
    noData: "暂无数据"
  },
  scanner: {
    title: "菜单精灵",
    subtitle: "上传餐厅菜单照片，获取 KHC 酱料推荐",
    visionNotice:
      "菜单精灵使用 Qwen（视觉 AI 模型）。DeepSeek 不支持图像分析。",
    dropHere: "拖放菜单图片到此处",
    orClickToUpload: "或点击上传",
    chooseFile: "选择文件",
    takePhoto: "拍照",
    clickToChange: "点击更换图片",
    scanning: "扫描中...",
    scanMenu: "🔍 扫描菜单",
    recognizedDishes: "识别的菜品",
    selectImage: "请选择图片文件",
    failedToScan: "扫描失败",
    sampleImages: "示例菜单图片",
    sampleTexts: "示例文本菜单",
    menuPreview: "菜单内容预览",
    askCoach: "问问陪练",
    confidence: {
      high: "高",
      medium: "中",
      low: "低",
    },
  },
  chat: {
    title: "AI 专属陪练",
    model: "模型",
    greeting: "你好！我是您的 AI 专属陪练。",
    greetingDesc:
      "我可以帮助您了解产品知识、销售技巧和 KHC 酱料的菜单搭配建议。今天想学些什么？",
    aiCoachLabel: "🤖 AI 教练",
    typeMessage: "输入消息...",
    failedToGetResponse: "抱歉，出现错误。请重试。",
  },
  history: {
    title: "对话历史",
    subtitle: "您的历史对话和菜单扫描记录",
    noHistory: "暂无历史记录",
    noHistoryDesc: "开始扫描菜单或与 AI 教练聊天吧",
    scanMenu: "扫描菜单",
    startChatting: "开始聊天",
    untitled: "未命名对话",
    menuScan: "菜单扫描",
    dishes: "道菜",
    chat: "聊天",
    messages: "条消息",
    justNow: "刚刚",
    minutesAgo: "分钟前",
    hoursAgo: "小时前",
    daysAgo: "天前",
  },
  language: {
    en: "English",
    zh: "中文",
  },
}

export const translations: Record<Locale, Translations> = { en, zh }
