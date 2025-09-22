"use client"

import { useEffect, useState } from "react"
import { CampaignCard } from "@/components/campaign-card"
import { listCampaigns } from "@/lib/contract"

export default function ClientCampaignGrid() {
  const [items, setItems] = useState<
    Array<{ id: number; title: string; description: string; goal: string; raised: string; progress: number; daysLeft: number; donorCount: number; category: string }>
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await listCampaigns()
        if (!mounted) return
        const mapped = data.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          goal: c.goalEth,
          raised: c.raisedEth,
          progress: c.progressPct,
          daysLeft: c.daysLeft,
          donorCount: c.donorCount,
          category: "General",
        }))
        setItems(mapped)
      } catch (e: any) {
        setError(e.message || "Failed to load campaigns")
      } finally {
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">Loading campaigns...</div>
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>
  }

  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground">No campaigns found.</div>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((c) => (
        <CampaignCard key={c.id} {...c} />
      ))}
    </div>
  )
} 