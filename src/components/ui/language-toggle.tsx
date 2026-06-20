"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage, Locale } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
]

export function LanguageToggle({ className }: { className?: string } = {}) {
  const { locale, setLocale, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = languages.find((l) => l.code === locale) || languages[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn("px-3 py-2 text-sm font-medium border border-hairline rounded-lg hover:bg-surface-soft transition-colors flex items-center gap-2 h-11", className)}
      >
        <span>{current.code === "zh" ? "中文" : "English"}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute mt-2 w-40 bg-white border border-hairline rounded-lg shadow-lg overflow-hidden z-50 left-0 md:right-0 md:left-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code)
                setOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-surface-soft transition-colors ${
                locale === lang.code ? "bg-surface-soft" : ""
              }`}
            >
              <span className="text-sm font-medium">{lang.label}</span>
              {locale === lang.code && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
