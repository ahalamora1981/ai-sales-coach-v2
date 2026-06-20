"use client"

import { Suspense } from "react"
import ChatContent from "./content"

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted">Loading...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
