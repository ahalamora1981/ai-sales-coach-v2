"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { useEffect, useState } from "react"

interface DashboardStats {
  scanCount: number
  chatCount: number
}

interface KnowledgeBase {
  totalSauces: number
  totalCategories: number
  categories: { name: string; count: number }[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>({ scanCount: 0, chatCount: 0 })
  const [knowledge, setKnowledge] = useState<KnowledgeBase>({ totalSauces: 0, totalCategories: 0, categories: [] })

  const firstName = session?.user?.name?.split(" ")[0] || ""

  useEffect(() => {
    fetch("/api/dashboard/stats").then(r => r.json()).then(setStats)
    fetch("/api/dashboard/knowledge").then(r => r.json()).then(setKnowledge)
  }, [])

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

      {/* Knowledge Base & Usage Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Knowledge Base */}
        <div className="bg-white rounded-xl border border-hairline p-6">
          <h3 className="text-xl font-semibold text-ink mb-2">
            {t.dashboard.knowledgeBase}
          </h3>
          <p className="text-base text-muted mb-4">
            {t.dashboard.knowledgeBaseDesc}
          </p>
          <div className="space-y-2 mb-4">
            <p className="text-lg font-medium text-ink">
              {knowledge.totalSauces} {t.dashboard.sauces}
            </p>
            <p className="text-base text-muted">
              {knowledge.totalCategories} {t.dashboard.categories}
            </p>
          </div>
          {knowledge.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {knowledge.categories.map((cat) => (
                <span
                  key={cat.name}
                  className="px-3 py-1 bg-surface-soft rounded-full text-sm text-muted"
                >
                  {cat.name} ({cat.count})
                </span>
              ))}
            </div>
          )}
          <Link href="/dashboard/scanner">
            <Button variant="outline" size="sm">
              {t.dashboard.viewAllSauces}
            </Button>
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
          <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl border border-hairline p-6">
        <h3 className="text-xl font-semibold text-ink mb-4">
          {t.dashboard.recentActivity}
        </h3>
        <p className="text-muted text-base">{t.dashboard.noActivity}</p>
      </div>
    </div>
  )
}
