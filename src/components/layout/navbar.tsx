"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { useState } from "react"

// SVG Icons
const DashboardIcon = ({ active }: { active: boolean }) => (
  <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
)

const ScannerIcon = ({ active }: { active: boolean }) => (
  <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
  </svg>
)

const ChatIcon = ({ active }: { active: boolean }) => (
  <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
)

const HistoryIcon = ({ active }: { active: boolean }) => (
  <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const UserIcon = ({ active }: { active: boolean }) => (
  <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const navItems = [
  { href: "/dashboard", icon: DashboardIcon, labelKey: "dashboard" },
  { href: "/dashboard/scanner", icon: ScannerIcon, labelKey: "scanner" },
  { href: "/dashboard/chat", icon: ChatIcon, labelKey: "aiCoach" },
  { href: "/dashboard/history", icon: HistoryIcon, labelKey: "history" },
]

const experienceLabels: Record<string, Record<string, string>> = {
  en: { beginner: "Beginner", intermediate: "Intermediate", expert: "Expert" },
  zh: { beginner: "初级", intermediate: "中级", expert: "专家" },
}

const experienceColors: Record<string, string> = {
  beginner: "bg-blue-100 text-blue-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  expert: "bg-green-100 text-green-800",
}

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { t, locale } = useLanguage()
  const [showProfile, setShowProfile] = useState(false)

  const navLabels: Record<string, string> = {
    dashboard: t.nav.dashboard,
    scanner: t.nav.scanner,
    aiCoach: t.nav.aiCoach,
    history: t.nav.history,
  }

  // Get initials from name
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?"
    // For Chinese names like "小王 (Xiao Wang)", get first character
    const chineseName = name.split(" (")[0]
    if (chineseName) return chineseName.charAt(0)
    return name.charAt(0).toUpperCase()
  }

  // Get experience from session (we'll need to add this to the session)
  const experience = (session as any)?.user?.experience || "beginner"

  return (
    <>
      {/* Desktop Header - hidden on mobile */}
      <header className="bg-white border-b border-hairline sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="font-title font-bold text-3xl text-ink">
                {t.appName}
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-lg font-medium transition-colors",
                    pathname === item.href
                      ? "bg-surface-soft text-ink"
                      : "text-muted hover:text-ink hover:bg-surface-soft"
                  )}
                >
                  {navLabels[item.labelKey]}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <LanguageToggle />
              
              {session?.user && (
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-soft transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {getInitials(session.user.name)}
                      </span>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-base font-medium text-ink">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-muted">{session.user.email}</p>
                    </div>
                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {showProfile && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowProfile(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-hairline z-50 p-4">
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-hairline">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xl font-medium text-primary">
                              {getInitials(session.user.name)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-ink">{session.user.name}</p>
                            <p className="text-sm text-muted">{session.user.email}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3 pb-3 border-b border-hairline">
                          <p className="text-sm text-muted mb-1">{locale === "zh" ? "经验等级" : "Experience Level"}</p>
                          <span className={cn("text-sm px-2 py-1 rounded-full", experienceColors[experience])}>
                            {experienceLabels[locale][experience]}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          className="w-full justify-start text-muted"
                          onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {t.signOut}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar - hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-hairline z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                  isActive ? "text-primary" : "text-muted"
                )}
              >
                <Icon active={isActive} />
                <span className="text-xs mt-0.5">{navLabels[item.labelKey]}</span>
              </Link>
            )
          })}
          {/* Mobile Profile Button */}
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex flex-col items-center justify-center flex-1 h-full text-muted"
          >
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {session?.user ? getInitials(session.user.name) : "?"}
              </span>
            </div>
            <span className="text-xs mt-0.5">{locale === "zh" ? "我的" : "Me"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Profile Modal */}
      {showProfile && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowProfile(false)}
          />
          <div className="relative bg-white rounded-t-2xl w-full max-w-lg p-6 pb-24">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            {session?.user && (
              <>
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-hairline">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-medium text-primary">
                      {getInitials(session.user.name)}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-ink">{session.user.name}</p>
                    <p className="text-sm text-muted">{session.user.email}</p>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-hairline">
                  <p className="text-sm text-muted mb-2">{locale === "zh" ? "经验等级" : "Experience Level"}</p>
                  <span className={cn("text-sm px-3 py-1 rounded-full", experienceColors[experience])}>
                    {experienceLabels[locale][experience]}
                  </span>
                </div>

                <div className="flex gap-3">
                  <div className="h-11">
                    <LanguageToggle />
                  </div>
                  <Button
                    variant="outline"
                    className="flex-1 h-11"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t.signOut}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
