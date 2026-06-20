"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { Collapsible } from "@/components/ui/collapsible"

interface Memory {
  id: string
  memoryType: string
  content: string
  metadata: Record<string, unknown>
  updatedAt: string
}

interface MemoryStats {
  knowledge: number
  preference: number
  restaurant: number
  scenario: number
  total: number
}

export function MemoryDisplay() {
  const { locale } = useLanguage()
  
  // Chinese mappings for cuisines and regions
  const cuisineNames: Record<string, string> = {
    sichuan: "川菜",
    cantonese: "粤菜",
    hunan: "湘菜",
    shandong: "鲁菜",
    jiangsu: "苏菜",
    zhejiang: "浙菜",
    fujian: "闽菜",
    anhui: "徽菜",
    henan: "豫菜",
    northeast: "东北菜",
    hubei: "鄂菜",
    xinjiang: "新疆菜",
    yunnan: "滇菜",
  }
  
  const regionNames: Record<string, string> = {
    beijing: "北京",
    shanghai: "上海",
    guangzhou: "广州",
    chengdu: "成都",
    chongqing: "重庆",
  }
  
  const getCuisineName = (cuisine: string) => {
    return locale === "zh" ? (cuisineNames[cuisine] || cuisine) : cuisine
  }
  
  const getRegionName = (region: string) => {
    return locale === "zh" ? (regionNames[region] || region) : region
  }
  const [memories, setMemories] = useState<Memory[]>([])
  const [stats, setStats] = useState<MemoryStats>({
    knowledge: 0,
    preference: 0,
    restaurant: 0,
    scenario: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      const response = await fetch("/api/memories", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setMemories(data.memories || [])
        setStats(data.stats || { knowledge: 0, preference: 0, restaurant: 0, scenario: 0, total: 0 })
      }
    } catch (error) {
      console.error("Failed to fetch memories:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-hairline p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-soft rounded w-1/3"></div>
          <div className="h-4 bg-surface-soft rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (stats.total === 0) {
    return null
  }

  // Group memories by type
  const knowledgeMemories = memories.filter((m) => m.memoryType === "knowledge")
  const preferenceMemories = memories.filter((m) => m.memoryType === "preference")
  const restaurantMemories = memories.filter((m) => m.memoryType === "restaurant")
  const scenarioMemories = memories.filter((m) => m.memoryType === "scenario")

  // Get unique sauces from knowledge memories
  const knownSauces = Array.from(new Set(
    knowledgeMemories.map((m) => m.metadata?.sauceNameZh as string || m.metadata?.sauceName as string)
  )).filter(Boolean)

  // Get preferences
  const cuisinePrefs = preferenceMemories
    .filter((m) => (m.metadata?.category as string) === "cuisine")
    .map((m) => m.metadata?.value as string)
    .filter(Boolean)

  const regionPrefs = preferenceMemories
    .filter((m) => (m.metadata?.category as string) === "region")
    .map((m) => m.metadata?.value as string)
    .filter(Boolean)

  // Get restaurants
  const restaurants = restaurantMemories.map((m) => ({
    name: m.metadata?.restaurantName as string,
    cuisine: m.metadata?.cuisineType as string,
    scanCount: (m.metadata?.scanCount as number) || 1,
    dishes: (m.metadata?.dishesScanned as string[]) || [],
  }))

  return (
    <div className="bg-white rounded-xl border border-hairline p-6 space-y-6">
      <h3 className="text-xl font-semibold text-ink">
        {locale === "zh" ? "学习档案" : "Learning Profile"}
      </h3>



      {/* Knowledge - Sauces Learned */}
      {knownSauces.length > 0 && (
        <Collapsible
          title={locale === "zh" ? `已学酱料 (${knownSauces.length})` : `Learned Sauces (${knownSauces.length})`}
          defaultOpen={true}
        >
          <div className="flex flex-wrap gap-2">
            {knownSauces.map((sauce) => (
              <span
                key={sauce}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {sauce}
              </span>
            ))}
          </div>
        </Collapsible>
      )}



      {/* Scanned Menus */}
      {restaurants.length > 0 && (
        <Collapsible
          title={locale === "zh" ? `已扫描菜单 (${restaurants.length})` : `Scanned Menus (${restaurants.length})`}
          defaultOpen={false}
        >
          <div className="space-y-3">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.name}
                className="p-3 bg-surface-soft rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">{restaurant.name}</p>
                    <p className="text-sm text-muted">{restaurant.cuisine}</p>
                  </div>
                  <span className="text-sm text-muted">
                    {restaurant.scanCount} {locale === "zh" ? "次" : " visits"}
                  </span>
                </div>
                {restaurant.dishes.length > 0 && (
                  <div className="mt-2 text-sm text-muted">
                    {locale === "zh" ? "菜品" : "Dishes"}: {restaurant.dishes.slice(0, 3).join(", ")}
                    {restaurant.dishes.length > 3 && ` +${restaurant.dishes.length - 3}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Knowledge Points (from thumbs up) */}
      {knowledgePointMemories.length > 0 && (
        <Collapsible
          title={locale === "zh" ? `已学习知识点 (${knowledgePointMemories.length})` : `Learned Knowledge Points (${knowledgePointMemories.length})`}
          defaultOpen={false}
        >
          <div className="space-y-2">
            {knowledgePointMemories.map((point) => (
              <div
                key={point.id}
                className="p-3 bg-surface-soft rounded-lg text-sm text-body"
              >
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{point.content}</span>
                </div>
              </div>
            ))}
          </div>
        </Collapsible>
      )}
    </div>
  )
}
