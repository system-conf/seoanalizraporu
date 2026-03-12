"use client"

import { KpiCards } from "@/components/kpi-cards"
import { DashboardCharts } from "@/components/dashboard-charts"
import { CampaignTable } from "@/components/campaign-table"
import { CurrencyProvider } from "@/lib/currency"

import { useEffect, useState } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function DashboardContent() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) throw new Error('Veri yuklenemedi')
        const result = await response.json()
        setData(result)
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
        <span className="ml-2 text-sm text-muted-foreground">Veriler yukleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>
          Veritabanina baglanilamadi. Lutfen MySQL baglantinizi ve tablolarinizi kontrol edin. {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kontrol Paneli</h1>
          <p className="text-sm text-muted-foreground">
            Tum platformlardaki reklam performansinizin genel gorunumu.
          </p>
        </div>
      </div>
      <KpiCards kpiData={data.stats} />
      <DashboardCharts trendData={data.trend} platformData={data.platforms} />
      <CampaignTable campaigns={data.campaigns} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <CurrencyProvider>
      <DashboardContent />
    </CurrencyProvider>
  )
}
