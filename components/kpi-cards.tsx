"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { kpiData } from "@/lib/mock-data"

export function KpiCards() {
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
                  {kpi.value}
                </span>
                <div className="flex items-center gap-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="size-3 text-success" />
                  ) : (
                    <TrendingDown className="size-3 text-success" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      kpi.trend === "up" ? "text-success" : "text-success"
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className="h-10 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpi.sparkline.map((v, i) => ({ v, i }))}>
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
                          stopColor="var(--color-primary)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--color-primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="var(--color-primary)"
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
