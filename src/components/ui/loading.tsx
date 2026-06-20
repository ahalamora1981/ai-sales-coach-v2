"use client"

import { cn } from "@/lib/utils"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <div className="w-8 h-8 border-2 border-surface-card rounded-full" />
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-3">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-hairline rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-surface-soft rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-soft rounded w-1/3" />
          <div className="h-3 bg-surface-soft rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner />
      <p className="text-muted text-sm">Loading...</p>
    </div>
  )
}
