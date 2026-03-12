"use client"

import { Fragment, useEffect, useState } from "react"
import {
  FileText,
  FileSpreadsheet,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const platformColors: Record<string, string> = {
  Google: "bg-chart-1/15 text-chart-1 border-chart-1/20",
  Meta: "bg-chart-2/15 text-chart-2 border-chart-2/20",
  TikTok: "bg-chart-3/15 text-chart-3 border-chart-3/20",
}

type SortKey = "name" | "impressions" | "clicks" | "ctr" | "conversions" | "spend" | "revenue" | "roas"

export default function ReportsPage() {
  const [reportsData, setReportsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [platformFilter, setPlatformFilter] = useState("all")
  const [sortKey, setSortKey] = useState<SortKey>("roas")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          if (response.status === 401) {
             window.location.href = '/';
             return;
          }
          throw new Error('Veri yuklenemedi')
        }
        const result = await response.json()
        setReportsData(result.campaigns)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const filteredData = reportsData
    .filter((r) => platformFilter === "all" || r.platform.toLowerCase() === platformFilter)
    .sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })

  const totals = filteredData.reduce(
    (acc, r) => ({
      impressions: acc.impressions + (r.impressions || 0),
      clicks: acc.clicks + (r.clicks || 0),
      conversions: acc.conversions + (r.conversions || 0),
      spend: acc.spend + (r.spend || 0),
      revenue: acc.revenue + (r.revenue || 0),
    }),
    { impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 }
  )

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Raporlar yukleniyor...</span>
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

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
        <ArrowUpDown className="size-3" />
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Raporlar
          </h1>
          <p className="text-sm text-muted-foreground">
            Detayli kampanya performans metrikleri ve analizler.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-border text-muted-foreground hover:text-foreground">
            <FileText className="size-4" />
            {"PDF'e Aktar"}
          </Button>
          <Button variant="outline" className="gap-2 border-border text-muted-foreground hover:text-foreground">
            <FileSpreadsheet className="size-4" />
            {"Excel'e Aktar"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Toplam Gosterim", value: totals.impressions.toLocaleString() },
          { label: "Toplam Tiklama", value: totals.clicks.toLocaleString() },
          { label: "Toplam Donusum", value: totals.conversions.toLocaleString() },
          {
            label: "Toplam Harcama",
            value: `₺${totals.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          },
          {
            label: "Toplam Gelir",
            value: `₺${totals.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardHeader className="flex-row items-center gap-4 pb-4">
          <Filter className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium text-foreground">
            Filtreler
          </CardTitle>
          <div className="flex flex-1 items-center gap-3">
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-40 border-border bg-secondary text-foreground">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tum Platformlar</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="meta">Meta</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="30d">
              <SelectTrigger className="w-40 border-border bg-secondary text-foreground">
                <SelectValue placeholder="Tarih araligi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Son 7 gun</SelectItem>
                <SelectItem value="30d">Son 30 gun</SelectItem>
                <SelectItem value="90d">Son 90 gun</SelectItem>
                <SelectItem value="ytd">Yil basinda bu yana</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-48 border-border bg-secondary text-foreground">
                <SelectValue placeholder="Kampanya" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tum Kampanyalar</SelectItem>
                {reportsData.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Reports Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-8" />
                  <TableHead>
                    <SortHeader label="Kampanya" field="name" />
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Platform
                  </TableHead>
                  <TableHead className="text-right">
                    <SortHeader label="Gosterim" field="impressions" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortHeader label="Tiklama" field="clicks" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortHeader label="TO" field="ctr" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortHeader label="Donusum" field="conversions" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortHeader label="Harcama" field="spend" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortHeader label="Gelir" field="revenue" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortHeader label="ROAS" field="roas" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((report) => (
                  <Fragment key={report.id}>
                    <TableRow
                      key={report.id}
                      className="cursor-pointer border-border transition-colors hover:bg-accent/50"
                      onClick={() =>
                        setExpandedRow(
                          expandedRow === report.id ? null : report.id
                        )
                      }
                    >
                      <TableCell>
                        {expandedRow === report.id ? (
                          <ChevronUp className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {report.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={platformColors[report.platform]}
                        >
                          {report.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-foreground">
                        {(report.impressions || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-foreground">
                        {(report.clicks || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-foreground">
                        %{report.ctr?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-foreground">
                        {(report.conversions || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-foreground">
                        ₺{(report.spend || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-foreground">
                        ₺{(report.revenue || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            (report.roas || 0) >= 5
                              ? "bg-success/15 text-success border-success/20"
                              : report.roas >= 3
                              ? "bg-chart-1/15 text-chart-1 border-chart-1/20"
                              : "bg-warning/15 text-warning border-warning/20"
                          }
                        >
                          {report.roas}x
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {expandedRow === report.id && (
                      <TableRow
                        key={`${report.id}-expanded`}
                        className="border-border bg-secondary/30"
                      >
                        <TableCell colSpan={10}>
                          <div className="grid gap-4 p-4 sm:grid-cols-4">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Tiklama Basina Maliyet
                              </p>
                              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                                ₺{report.cpc}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Bin Gosterim Maliyeti
                              </p>
                              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                                ₺{report.cpm}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Donusum Orani
                              </p>
                              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                                %{((report.conversions / report.clicks) * 100).toFixed(1)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Donusum Basina Gelir
                              </p>
                              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                                ₺{(report.revenue / report.conversions).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
