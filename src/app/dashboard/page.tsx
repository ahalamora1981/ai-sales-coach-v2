"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { Collapsible } from "@/components/ui/collapsible"
import { sauceKnowledgeBase, cuisineKnowledgeBase, categoryNames } from "@/lib/knowledge-data"
import { useEffect, useState } from "react"

interface DashboardStats {
  scanCount: number
  chatCount: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { t, locale } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>({ scanCount: 0, chatCount: 0 })

  const firstName = session?.user?.name?.split(" ")[0] || ""

  useEffect(() => {
    fetch("/api/dashboard/stats", { credentials: "include" })
      .then(r => r.ok ? r.json() : { scanCount: 0, chatCount: 0 })
      .then(setStats)
      .catch(() => setStats({ scanCount: 0, chatCount: 0 }))
  }, [])

  // Group sauces by category
  const saucesByCategory = sauceKnowledgeBase.reduce((acc, sauce) => {
    if (!acc[sauce.category]) {
      acc[sauce.category] = []
    }
    acc[sauce.category].push(sauce)
    return acc
  }, {} as Record<string, typeof sauceKnowledgeBase>)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-title font-bold text-ink">
          {t.dashboard.welcomeBack}, {firstName}
        </h1>
        <p className="text-lg text-muted mt-1">{t.dashboard.subtitle}</p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Menu Scanner Card */}
        <Link href="/dashboard/scanner" className="block h-full">
          <div className="bg-white rounded-xl border border-hairline p-6 hover:shadow-lg transition-shadow cursor-pointer group h-full">
            <h2 className="text-2xl font-semibold text-ink group-hover:text-primary transition-colors">
              {t.dashboard.menuScanner}
            </h2>
            <p className="text-base text-muted mt-2">
              {t.dashboard.menuScannerDesc}
            </p>
            <Button className="mt-4" size="sm">
              {t.dashboard.startScanning}
            </Button>
          </div>
        </Link>

        {/* AI Coach Card */}
        <Link href="/dashboard/chat" className="block h-full">
          <div className="bg-white rounded-xl border border-hairline p-6 hover:shadow-lg transition-shadow cursor-pointer group h-full">
            <h2 className="text-2xl font-semibold text-ink group-hover:text-primary transition-colors">
              {t.dashboard.aiSalesCoach}
            </h2>
            <p className="text-base text-muted mt-2">
              {t.dashboard.aiSalesCoachDesc}
            </p>
            <Button className="mt-4" size="sm">
              {t.dashboard.startChatting}
            </Button>
          </div>
        </Link>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-xl border border-hairline p-6">
        <h3 className="text-xl font-semibold text-ink mb-2">
          {t.dashboard.usageStats}
        </h3>
        <p className="text-base text-muted mb-4">
          {t.dashboard.recentActivity}
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="bg-surface-soft rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {stats.scanCount}
            </p>
            <p className="text-base text-muted mt-1">
              {t.dashboard.menuScans}
            </p>
          </div>
          <div className="bg-surface-soft rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {stats.chatCount}
            </p>
            <p className="text-base text-muted mt-1">
              {t.dashboard.chatSessions}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Knowledge Base */}
      <div className="bg-white rounded-xl border border-hairline p-6">
        <h3 className="text-xl font-semibold text-ink mb-4">
          {locale === "zh" ? "菜品酱料知识库" : "Sauce & Cuisine Knowledge Base"}
        </h3>
        
        <div className="space-y-4">
          {/* Cuisines Section */}
          <Collapsible 
            title={locale === "zh" ? `菜系知识 (${cuisineKnowledgeBase.length})` : `Cuisine Knowledge (${cuisineKnowledgeBase.length})`}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {cuisineKnowledgeBase.map((cuisine) => (
                <div key={cuisine.id} className="p-4 bg-surface-soft rounded-lg">
                  <h4 className="text-lg font-semibold text-ink mb-2">
                    {locale === "zh" ? cuisine.nameZh : cuisine.name}
                  </h4>
                  <p className="text-base text-muted mb-2">{cuisine.characteristics}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-ink mb-1">
                        {locale === "zh" ? "风味特点" : "Flavor Profile"}
                      </p>
                      <p className="text-muted">{cuisine.flavorProfile}</p>
                    </div>
                    <div>
                      <p className="font-medium text-ink mb-1">
                        {locale === "zh" ? "代表菜品" : "Signature Dishes"}
                      </p>
                      <p className="text-muted">{cuisine.signatureDishes.join("、")}</p>
                    </div>
                    <div>
                      <p className="font-medium text-ink mb-1">
                        {locale === "zh" ? "推荐酱料" : "Recommended Sauces"}
                      </p>
                      <p className="text-muted">{cuisine.sauceRecommendations.join("、")}</p>
                    </div>
                    <div>
                      <p className="font-medium text-ink mb-1">
                        {locale === "zh" ? "核心调料" : "Key Ingredients"}
                      </p>
                      <p className="text-muted">{cuisine.keyIngredients.join("、")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Collapsible>

          {/* Sauces Section by Category */}
          {Object.entries(saucesByCategory).map(([category, sauces]) => (
            <Collapsible 
              key={category}
              title={`${categoryNames[category] || category} (${sauces.length}${locale === "zh" ? "款" : " sauces"})`}
            >
              <div className="space-y-4">
                {sauces.map((sauce) => (
                  <div key={sauce.id} className="p-4 bg-surface-soft rounded-lg">
                    <h4 className="text-lg font-semibold text-ink mb-1">
                      {locale === "zh" ? sauce.nameZh : sauce.name}
                    </h4>
                    <p className="text-sm text-muted mb-2">{sauce.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-ink mb-1">
                          {locale === "zh" ? "特点" : "Features"}
                        </p>
                        <p className="text-muted">{sauce.keyFeatures.join("、")}</p>
                      </div>
                      <div>
                        <p className="font-medium text-ink mb-1">
                          {locale === "zh" ? "使用方法" : "Usage"}
                        </p>
                        <p className="text-muted">{sauce.usageMethods[0]}</p>
                      </div>
                      <div>
                        <p className="font-medium text-ink mb-1">
                          {locale === "zh" ? "搭配推荐" : "Best Pairings"}
                        </p>
                        <p className="text-muted">{sauce.bestPairings.join("、")}</p>
                      </div>
                      <div>
                        <p className="font-medium text-ink mb-1">
                          {locale === "zh" ? "专业建议" : "Pro Tips"}
                        </p>
                        <p className="text-muted">{sauce.proTips[0]}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <p className="text-muted">
                        <span className="font-medium">{locale === "zh" ? "相关菜系" : "Related Cuisines"}:</span> {sauce.relatedCuisines.join("、")}
                      </p>
                    </div>
                    <div className="mt-1 text-sm">
                      <p className="text-muted">
                        <span className="font-medium">{locale === "zh" ? "保质期" : "Shelf Life"}:</span> {sauce.shelfLife}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  )
}
