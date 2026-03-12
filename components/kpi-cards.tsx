"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { useCurrency } from "@/lib/currency"
import { Card, CardContent } from "@/components/ui/card"

interface KpiData {
  title: string
  rawValue: number
  trend: "up" | "down"
  percentage: string
  isCurrency?: boolean
  chartData: number[] | { value: number }[]
}

export function KpiCards({ kpiData }: { kpiData: KpiData[] }) {
  const { format } = useCurrency()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiData.map((kpi) => (
        <Card
          key={kpi.title}
          className="border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5"
        >
          <CardContent className="flex flex-col gap-3 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {kpi.title}
            </p>
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {kpi.isCurrency ? format(kpi.rawValue, { compact: true }) : (kpi.rawValue >= 1000000 ? `${(kpi.rawValue / 1000000).toFixed(1)}M` : (kpi.rawValue >= 1000 ? `${(kpi.rawValue / 1000).toFixed(0)}k` : kpi.rawValue))}
                </span>
                <div className="flex items-center gap-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="size-3 text-success" />
                  ) : (
                    <TrendingDown className="size-3 text-success" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      kpi.trend === "up" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {kpi.percentage}
                  </span>
                </div>
              </div>
              <div className="h-10 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={(kpi.chartData || []).map((v, i) => typeof v === 'number' ? { value: v, i } : { ...v, i })}>
                    <defs>
                      <linearGradient
                        id={`sparkGradient-${kpi.title.replace(/\s/g, "")}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={kpi.trend === "up" ? "var(--color-success)" : "var(--color-destructive)"}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor={kpi.trend === "up" ? "var(--color-success)" : "var(--color-destructive)"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey={typeof (kpi.chartData?.[0]) === 'number' ? "value" : "value"}
                      stroke={kpi.trend === "up" ? "var(--color-success)" : "var(--color-destructive)"}
                      strokeWidth={1.5}
                      fill={`url(#sparkGradient-${kpi.title.replace(/\s/g, "")})`}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
