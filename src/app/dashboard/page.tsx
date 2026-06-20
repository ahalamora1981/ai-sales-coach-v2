"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { t } = useLanguage()

  const firstName = session?.user?.name?.split(" ")[0] || ""

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

      {/* Quick Stats */}
      <div className="bg-surface-soft rounded-xl p-6">
        <h3 className="text-xl font-semibold text-ink mb-4">
          {t.dashboard.quickStart}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-1 text-muted">•</div>
            <p className="text-base text-muted">{t.dashboard.saucesCount}</p>
            <p className="text-sm text-muted-soft">
              {t.dashboard.inKnowledgeBase}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-1 text-muted">•</div>
            <p className="text-base text-muted">{t.dashboard.cuisinesCount}</p>
            <p className="text-sm text-muted-soft">
              {t.dashboard.cuisinesList}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-1 text-muted">•</div>
            <p className="text-base text-muted">{t.dashboard.adaptiveAi}</p>
            <p className="text-sm text-muted-soft">
              {t.dashboard.adaptiveAiDesc}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-1 text-muted">•</div>
            <p className="text-base text-muted">{t.dashboard.multiModel}</p>
            <p className="text-sm text-muted-soft">
              {t.dashboard.multiModelDesc}
            </p>
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
