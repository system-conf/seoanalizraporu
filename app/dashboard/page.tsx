"use client"

import { KpiCards } from "@/components/kpi-cards"
import { DashboardCharts } from "@/components/dashboard-charts"
import { CampaignTable } from "@/components/campaign-table"
import { CurrencyProvider, currencies, useCurrency, type CurrencyCode } from "@/lib/currency"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function CurrencySelector() {
  const { currency, setCurrencyCode } = useCurrency()
  return (
    <Select value={currency.code} onValueChange={(v) => setCurrencyCode(v as CurrencyCode)}>
      <SelectTrigger className="w-52 border-border bg-secondary text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <span className="flex items-center gap-2">
              <span className="font-mono text-sm">{c.symbol}</span>
              <span>{c.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function DashboardContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kontrol Paneli</h1>
          <p className="text-sm text-muted-foreground">
            Tum platformlardaki reklam performansinizin genel gorunumu.
          </p>
        </div>
        <CurrencySelector />
      </div>
      <KpiCards />
      <DashboardCharts />
      <CampaignTable />
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
