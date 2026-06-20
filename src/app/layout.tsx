import type { Metadata } from "next"
import "@/styles/globals.css"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "AI Sales Coach - Kraft Heinz China",
  description: "AI-powered sales coach for KHC sauce products",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
