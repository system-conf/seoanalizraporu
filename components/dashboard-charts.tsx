"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
          <div
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            ₺{entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

const platformColors = [
  { name: "Google", fill: "var(--color-chart-1)" },
  { name: "Meta", fill: "var(--color-chart-2)" },
  { name: "TikTok", fill: "var(--color-chart-3)" },
]

export function DashboardCharts({ 
  trendData = [], 
  platformData = [] 
}: { 
  trendData?: any[], 
  platformData?: any[] 
}) {
  // Derive budget distribution from platformData
  const totalSpend = platformData.reduce((acc, p) => acc + Number(p.value), 0)
  const budgetDistributionData = platformData.map(p => ({
    name: p.name,
    value: totalSpend > 0 ? Math.round((Number(p.value) / totalSpend) * 100) : 0,
    fill: platformColors.find(c => c.name === p.name)?.fill || "var(--color-muted)"
  }))

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {/* Daily Spend Trend */}
      <Card className="border-border bg-card xl:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Gunluk Harcama Trendi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="googleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="metaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tiktokGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  tickFormatter={(v) => `₺${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingBottom: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="google"
                  name="Google"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#googleGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="meta"
                  name="Meta"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  fill="url(#metaGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="tiktok"
                  name="TikTok"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  fill="url(#tiktokGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Budget Distribution */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Butce Dagilimi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetDistributionData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {budgetDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const data = payload[0].payload as {
                      name: string
                      value: number
                      fill: string
                    }
                    return (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
                        <div className="flex items-center gap-2 text-sm">
                          <div
                            className="size-2 rounded-full"
                            style={{ backgroundColor: data.fill }}
                          />
                          <span className="text-foreground">{data.name}</span>
                          <span className="font-medium text-foreground">
                            %{data.value}
                          </span>
                        </div>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2">
            {budgetDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">%{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Comparison */}
      <Card className="border-border bg-card xl:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Platform Karsilastirmasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} barGap={8}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  name="Harcama"
                  fill="var(--color-chart-1)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
