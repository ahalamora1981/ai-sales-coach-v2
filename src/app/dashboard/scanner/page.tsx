"use client"

import { Suspense } from "react"
import ScannerContent from "./content"

export default function ScannerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted">Loading...</div>
      </div>
    }>
      <ScannerContent />
    </Suspense>
  )
}
