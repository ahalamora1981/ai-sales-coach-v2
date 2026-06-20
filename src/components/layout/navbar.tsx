"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/ui/language-toggle"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { t } = useLanguage()

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard },
    { href: "/dashboard/scanner", label: t.nav.scanner },
    { href: "/dashboard/chat", label: t.nav.aiCoach },
    { href: "/dashboard/history", label: t.nav.history },
  ]

  return (
    <header className="bg-white border-b border-hairline sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-title font-bold text-3xl text-ink">
              {t.appName}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
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
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            {session?.user && (
              <div className="text-right hidden sm:block">
                <p className="text-base font-medium text-ink">
                  {session.user.name}
                </p>
                <p className="text-sm text-muted">{session.user.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              {t.signOut}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t border-hairline">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center px-3 py-1",
                pathname === item.href ? "text-primary" : "text-muted"
              )}
            >
              <span className="text-sm uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
