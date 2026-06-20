"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation on mount and route change
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      className={`transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  )
}
