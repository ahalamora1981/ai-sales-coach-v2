"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { Locale, translations, Translations } from "./translations"
export type { Locale } from "./translations"

interface LanguageContextType {
  locale: Locale
  t: Translations
  toggleLanguage: () => void
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with English for SSR, then sync with localStorage on mount
  const [locale, setLocaleState] = useState<Locale>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale
    if (saved && saved !== locale) {
      setLocaleState(saved)
      document.documentElement.lang = saved === "zh" ? "zh-CN" : "en"
    }
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
    document.documentElement.lang = newLocale === "zh" ? "zh-CN" : "en"
  }, [])

  const toggleLanguage = useCallback(() => {
    setLocale(locale === "en" ? "zh" : "en")
  }, [locale, setLocale])

  const t = translations[locale]

  return (
    <LanguageContext.Provider value={{ locale, t, toggleLanguage, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
