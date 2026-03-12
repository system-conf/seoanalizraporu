"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/';
            return;
          }
          throw new Error('Veri yuklenemedi')
        }
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
        <span className="ml-2 text-sm text-muted-foreground">Analiz verileri yukleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>
          Veritabanina baglanilamadi. Lutfen MySQL baglantinizi kontrol edin. {error}
        </AlertDescription>
      </Alert>
    )
  }

  // Derived data for the conversion funnel from real stats
  const totalSpend = data.stats.find((s: any) => s.title === "Toplam Harcama")?.rawValue || 0
  const totalClicks = data.stats.find((s: any) => s.title === "Toplam Tiklama")?.rawValue || 0
  const totalConversions = data.stats.find((s: any) => s.title === "Donusumler")?.rawValue || 0
  const totalRevenue = data.stats.find((s: any) => s.title === "Gelir")?.rawValue || 0

  const conversionFunnelData = [
    { stage: "Harcama", value: totalSpend, fill: "var(--color-chart-1)" },
    { stage: "Tiklamalar", value: totalClicks, fill: "var(--color-chart-2)" },
    { stage: "Donusumler", value: totalConversions, fill: "var(--color-chart-3)" },
    { stage: "Gelir", value: totalRevenue, fill: "var(--color-chart-4)" },
  ]

  const hourlyData = data.hourly.map((h: any) => ({
    hour: `${h.hour}:00`,
    clicks: h.clicks,
    conversions: h.conversions,
  }))

  const deviceData = data.device.map((d: any, index: number) => ({
    name: d.name,
    value: Number(d.value),
    fill: `var(--color-chart-${(index % 4) + 1})`
  }))

  const geoData = data.geo.map((g: any) => ({
    country: g.country,
    spend: Number(g.spend),
    conversions: Number(g.conversions)
  }))

  const ageData = data.demo.reduce((acc: any[], curr: any) => {
    let existing = acc.find(a => a.age === curr.age_range);
    if (!existing) {
      existing = { age: curr.age_range, male: 0, female: 0 };
      acc.push(existing);
    }
    if (curr.gender === 'Male') existing.male = Number(curr.percentage);
    if (curr.gender === 'Female') existing.female = Number(curr.percentage);
    return acc;
  }, [])
  function CustomTooltip({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
    label?: string
  }) {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
        <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analitik</h1>
        <p className="text-sm text-muted-foreground">
          Reklam performans verilerinizin derinlemesine analizi.
        </p>
      </div>

      <Tabs defaultValue="overview" className="gap-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Genel Bakis</TabsTrigger>
          <TabsTrigger value="audience">Hedef Kitle</TabsTrigger>
          <TabsTrigger value="geography">Cografya</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Conversion Funnel */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Donusum Hunisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionFunnelData} layout="vertical" barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                        tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                      />
                      <YAxis
                        dataKey="stage"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {conversionFunnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Hourly Performance */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Saatlik Performans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                        interval={3}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="clicks"
                        name="Tiklamalar"
                        stroke="var(--color-chart-1)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="conversions"
                        name="Donusumler"
                        stroke="var(--color-chart-3)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Device Breakdown */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Cihaz Dagilimi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          const data = payload[0].payload as { name: string; value: number; fill: string }
                          return (
                            <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
                              <div className="flex items-center gap-2 text-sm">
                                <div className="size-2 rounded-full" style={{ backgroundColor: data.fill }} />
                                <span className="text-foreground">{data.name}</span>
                                <span className="font-medium text-foreground">%{data.value}</span>
                              </div>
                            </div>
                          )
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2">
                  {deviceData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium text-foreground">%{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Age Distribution */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Yas Dagilimi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageData}
                      barGap={2}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis
                        dataKey="age"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                        tickFormatter={(v) => `%${v}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="male" name="Erkek" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      <Bar dataKey="female" name="Kadin" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="flex flex-col gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Bolgeye Gore Performans
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Ulke
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Harcama
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Donusum
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        EBM
                      </th>
                      <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Pay
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {geoData.map((row) => {
                      const totalSpend = geoData.reduce((a, b) => a + b.spend, 0)
                      const share = ((row.spend / totalSpend) * 100).toFixed(1)
                      return (
                        <tr key={row.country} className="border-b border-border transition-colors hover:bg-accent/50">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {row.country}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm text-foreground">
                            {row.spend.toLocaleString()} ₺
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm text-foreground">
                            {row.conversions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm text-foreground">
                            {(row.spend / row.conversions).toFixed(2)} ₺
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 rounded-full bg-secondary">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{ width: `${share}%` }}
                                />
                              </div>
                              <span className="min-w-10 text-right text-xs text-muted-foreground">
                                %{share}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
