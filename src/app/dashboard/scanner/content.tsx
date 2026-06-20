"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { sampleImages, sampleTexts } from "@/lib/sample-menus"

interface Recommendation {
  sauce: string
  sauceZh?: string
  reason: string
  confidence: "high" | "medium" | "low"
}

interface Dish {
  originalName: string
  englishName?: string
  recommendations: Recommendation[]
}

export default function ScannerPage() {
  const { data: session } = useSession()
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<Dish[]>([])
  const [error, setError] = useState("")
  const [selectedSample, setSelectedSample] = useState<string | null>(null)
  const [textContent, setTextContent] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()

  // Load history on mount
  useEffect(() => {
    const historyId = searchParams.get("history")
    if (historyId) {
      loadHistory(historyId)
    }
  }, [searchParams])

  const loadHistory = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (response.ok) {
        const data = await response.json()
        const conv = data.conversation
        // Convert menuItems to results format
        const menuResults = conv.menuItems.map((item: { originalName: string; englishName: string; recommendations: Dish["recommendations"] }) => ({
          originalName: item.originalName,
          englishName: item.englishName,
          recommendations: item.recommendations,
        }))
        setResults(menuResults)
      }
    } catch (error) {
      console.error("Failed to load history:", error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError(t.scanner.selectImage)
      return
    }

    setError("")
    setImageFile(file)
    setSelectedSample(null)
    setTextContent(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSampleImageClick = async (src: string, id: string) => {
    setError("")
    setSelectedSample(id)
    setTextContent(null)
    setResults([])

    // Convert image URL to base64
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        // Create a File object for the scan
        const file = new File([blob], "sample.jpg", { type: "image/jpeg" })
        setImageFile(file)
      }
      reader.readAsDataURL(blob)
    } catch {
      setError("Failed to load sample image")
    }
  }

  const handleSampleTextClick = async (filename: string, id: string) => {
    setError("")
    setSelectedSample(id)
    setImage(null)
    setImageFile(null)
    setResults([])

    try {
      const response = await fetch(`/sample-menus/${filename}`)
      const text = await response.text()
      setTextContent(text)
    } catch {
      setError("Failed to load sample menu")
    }
  }

  const handleScan = async () => {
    if (!imageFile && !textContent) return

    setScanning(true)
    setError("")
    setResults([])

    try {
      if (imageFile && image) {
        // Image scan
        const response = await fetch("/api/scanner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, locale }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || t.scanner.failedToScan)
        }

        const data = await response.json()
        setResults(data.dishes || [])
      } else if (textContent) {
        // Text menu scan - use dedicated text scanner API (returns JSON)
        const response = await fetch("/api/scanner/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textContent, locale }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || t.scanner.failedToScan)
        }

        const data = await response.json()
        setResults(data.dishes || [])
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.scanner.failedToScan
      )
    } finally {
      setScanning(false)
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-title font-bold text-ink">
          {t.scanner.title}
        </h1>
        <p className="text-lg text-muted mt-1">{t.scanner.subtitle}</p>
      </div>

      {/* Upload Area */}
      <div
        className="bg-white border-2 border-dashed border-hairline rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {image ? (
          <div className="space-y-4">
            <img
              src={image}
              alt="Menu preview"
              className="max-h-96 mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-muted">{t.scanner.clickToChange}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl text-muted">+</div>
            <div>
              <p className="text-xl font-medium text-ink">
                {t.scanner.dropHere}
              </p>
              <p className="text-muted">{t.scanner.orClickToUpload}</p>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                {t.scanner.chooseFile}
              </Button>
              <Button variant="outline" size="sm">
                {t.scanner.takePhoto}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Text Content Preview */}
      {textContent && (
        <div className="bg-surface-soft rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-ink">
              {t.scanner.menuPreview}
            </h4>
            <button
              onClick={() => {
                setTextContent(null)
                setSelectedSample(null)
              }}
              className="text-sm text-muted hover:text-ink"
            >
              ✕
            </button>
          </div>
          <pre className="text-sm text-body whitespace-pre-wrap font-sans max-h-48 overflow-y-auto">
            {textContent}
          </pre>
        </div>
      )}

      {/* Scan Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleScan}
          disabled={(!image && !textContent) || scanning}
          size="lg"
        >
          {scanning ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              {t.scanner.scanning}
            </>
          ) : (
            <>{t.scanner.scanMenu}</>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-error text-sm p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink">
            {t.scanner.recognizedDishes} ({results.length})
          </h2>

          <div className="grid gap-4">
            {results.map((dish, index) => (
              <div
                key={index}
                className="bg-white border border-hairline rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">
                      {dish.originalName}
                    </h3>
                    {dish.englishName && (
                      <p className="text-sm text-muted">{dish.englishName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {dish.recommendations.map((rec, recIndex) => (
                    <div
                      key={recIndex}
                      className="bg-surface-soft rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-ink">
                          → {rec.sauce}
                        </span>
                        {rec.sauceZh && (
                          <span className="text-sm text-muted">
                            ({rec.sauceZh})
                          </span>
                        )}
                        {rec.confidence && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(
                              rec.confidence
                            )}`}
                          >
                            {t.scanner.confidence[rec.confidence]}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-body whitespace-pre-wrap">
                        {rec.reason}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Ask Coach Button */}
                <div className="mt-3 pt-3 border-t border-hairline flex justify-end">
                  <Button
                    size="sm"
                    className="bg-primary text-white hover:bg-primary-active"
                    onClick={() => {
                      const dishInfo = `菜品: ${dish.originalName}${dish.englishName ? ` (${dish.englishName})` : ""}`
                      const recInfo = dish.recommendations
                        .map(r => `- ${r.sauce}${r.sauceZh ? ` (${r.sauceZh})` : ""}: ${r.reason}`)
                        .join("\n")
                      const contextMessage = `${dishInfo}\n\n菜单精灵推荐:\n${recInfo}\n\n请问我该如何向客户介绍这道菜的酱料搭配？`
                      router.push(`/dashboard/chat?context=${encodeURIComponent(contextMessage)}`)
                    }}
                  >
                    {t.scanner.askCoach}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Menus Section */}
      <div className="space-y-6">
        {/* Sample Images */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-3">
            {t.scanner.sampleImages}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {sampleImages.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSampleImageClick(sample.src, sample.id)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                  selectedSample === sample.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-hairline hover:border-primary/50"
                }`}
              >
                <img
                  src={sample.src}
                  alt={locale === "zh" ? sample.labelZh : sample.label}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs text-white font-medium truncate">
                    {locale === "zh" ? sample.labelZh : sample.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sample Text Menus */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-3">
            {t.scanner.sampleTexts}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sampleTexts.map((sample) => (
              <button
                key={sample.id}
                onClick={() =>
                  handleSampleTextClick(sample.filename, sample.id)
                }
                className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedSample === sample.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-hairline hover:border-primary/50 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-muted">›</span>
                  <div>
                    <p className="font-medium text-ink">
                      {locale === "zh" ? sample.labelZh : sample.label}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {sample.filename}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
