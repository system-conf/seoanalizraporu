"use client"

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

const conversionFunnelData = [
  { stage: "Gosterimler", value: 9690000, fill: "var(--color-chart-1)" },
  { stage: "Tiklamalar", value: 384090, fill: "var(--color-chart-2)" },
  { stage: "Donusumler", value: 14996, fill: "var(--color-chart-3)" },
  { stage: "Gelir", value: 126122, fill: "var(--color-chart-4)" },
]

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  clicks: Math.floor(Math.random() * 5000 + 2000),
  conversions: Math.floor(Math.random() * 200 + 50),
}))

const deviceData = [
  { name: "Mobil", value: 58, fill: "var(--color-chart-1)" },
  { name: "Masaustu", value: 32, fill: "var(--color-chart-2)" },
  { name: "Tablet", value: 10, fill: "var(--color-chart-3)" },
]

const geoData = [
  { country: "Turkiye", spend: 24500, conversions: 8200 },
  { country: "Almanya", spend: 8200, conversions: 2800 },
  { country: "Ingiltere", spend: 6100, conversions: 1900 },
  { country: "Fransa", spend: 4800, conversions: 1200 },
  { country: "Hollanda", spend: 3100, conversions: 890 },
]

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

export default function AnalyticsPage() {
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
                      data={[
                        { age: "18-24", male: 22, female: 28 },
                        { age: "25-34", male: 30, female: 35 },
                        { age: "35-44", male: 25, female: 20 },
                        { age: "45-54", male: 15, female: 12 },
                        { age: "55+", male: 8, female: 5 },
                      ]}
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
                            ${row.spend.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm text-foreground">
                            {row.conversions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm text-foreground">
                            ${(row.spend / row.conversions).toFixed(2)}
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
