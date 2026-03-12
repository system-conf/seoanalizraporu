"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PlusCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CampaignTable } from "@/components/campaign-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/campaigns')
        if (!response.ok) throw new Error('Kampanyalar yuklenemedi')
        const data = await response.json()
        setCampaigns(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Kampanyalar yukleniyor...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kampanyalar
          </h1>
          <p className="text-sm text-muted-foreground">
            Tum reklam kampanyalarinizi yonetin.
          </p>
        </div>
        <Button asChild className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
          <Link href="/dashboard/campaigns/create">
            <PlusCircle className="size-4" />
            Kampanya Olustur
          </Link>
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <CampaignTable campaigns={campaigns} />
      )}
    </div>
  )
}
