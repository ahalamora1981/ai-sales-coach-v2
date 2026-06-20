"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"

interface Conversation {
  id: string
  title: string | null
  model: string
  type: string
  createdAt: string
  _count: {
    messages: number
    menuItems: number
  }
}

export default function HistoryPage() {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t.history.justNow
    if (diffMins < 60) return `${diffMins}${t.history.minutesAgo}`
    if (diffHours < 24) return `${diffHours}${t.history.hoursAgo}`
    if (diffDays < 7) return `${diffDays}${t.history.daysAgo}`

    return date.toLocaleDateString()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "scan":
        return "[Scan]"
      case "chat":
        return "[Chat]"
      default:
        return "[Msg]"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted">{t.loading}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-title font-bold text-ink">
          📚 {t.history.title}
        </h1>
        <p className="text-muted mt-1">{t.history.subtitle}</p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white border border-hairline rounded-xl p-12 text-center">
          <div className="text-6xl mb-4 text-muted">-</div>
          <h2 className="text-2xl font-semibold text-ink mb-2">
            {t.history.noHistory}
          </h2>
          <p className="text-lg text-muted mb-6">{t.history.noHistoryDesc}</p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/scanner">
              <Button>{t.history.scanMenu}</Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button variant="outline">{t.history.startChatting}</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={
                conv.type === "scan"
                  ? `/dashboard/scanner?history=${conv.id}`
                  : `/dashboard/chat?history=${conv.id}`
              }
            >
              <div className="bg-white border border-hairline rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(conv.type)}</span>
                    <div>
                      <h3 className="font-medium text-ink">
                        {conv.title || t.history.untitled}
                      </h3>
                      <p className="text-sm text-muted">
                        {conv.type === "scan" ? (
                          <>
                            {t.history.menuScan} • {conv._count.menuItems}{" "}
                            {t.history.dishes}
                          </>
                        ) : (
                          <>
                            {t.history.chat} • {conv._count.messages}{" "}
                            {t.history.messages}
                          </>
                        )}
                        {" • "}
                        <span className="capitalize">{conv.model}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted">
                      {formatDate(conv.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
