"use client"

import { SessionProvider } from "next-auth/react"
import { Navbar } from "@/components/layout/navbar"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { PageTransition } from "@/components/page-transition"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          <ErrorBoundary>
            <PageTransition>{children}</PageTransition>
          </ErrorBoundary>
        </main>
      </div>
    </SessionProvider>
  )
}
