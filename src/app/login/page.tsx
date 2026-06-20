"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/ui/language-toggle"

const demoAccounts = [
  { name: "小王 (Xiao Wang)", email: "wang@demo.com", experienceKey: "Beginner" as const },
  { name: "李姐 (Li Jie)", email: "li@demo.com", experienceKey: "Intermediate" as const },
  { name: "张总 (Zhang Zong)", email: "zhang@demo.com", experienceKey: "Expert" as const },
]

const experienceLabels = {
  en: { Beginner: "Beginner", Intermediate: "Intermediate", Expert: "Expert" },
  zh: { Beginner: "初级", Intermediate: "中级", Expert: "专家" },
}

export default function LoginPage() {
  const router = useRouter()
  const { t, locale } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(t.invalidCredentials)
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email: demoEmail,
      password: "demo123",
      redirect: false,
    })

    if (result?.error) {
      setError(t.invalidCredentials)
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-title font-bold text-ink mb-2">
            {t.appName}
          </h1>
          <p className="text-muted">{t.appTagline}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-hairline">
          <h2 className="text-2xl font-semibold text-ink mb-6">{t.signIn}</h2>

          {error && (
            <div className="bg-red-50 text-error text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-body mb-1"
              >
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                placeholder={t.emailPlaceholder}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-body mb-1"
              >
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                placeholder={t.passwordPlaceholder}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.signingIn : t.signIn}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-hairline">
            <p className="text-base text-muted mb-3">{t.demoLoginHint}</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email)}
                  disabled={loading}
                  className="w-full text-left px-4 py-3 rounded-lg border border-hairline hover:bg-surface-soft transition-colors disabled:opacity-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-ink text-base">{account.name}</p>
                      <p className="text-base text-muted">{account.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-surface-card rounded-full text-body">
                      {experienceLabels[locale][account.experienceKey]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted mt-6">
          {t.demoPasswordHint}{" "}
          <code className="font-body">{t.demoPassword}</code>
        </p>
      </div>
    </main>
  )
}
