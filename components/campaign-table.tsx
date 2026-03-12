"use client"

import { MoreHorizontal, Pause, Play, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Campaign {
  id: string
  name: string
  image_url?: string
  platform: string
  status: "Aktif" | "Duraklatildi" | "Tamamlandi"
  budget: number
  spend: number
  clicks: number
  add_to_cart: number
  conversions: number
  ctr: number
  cpc: number
  roas: number
}

const platformColors: Record<string, string> = {
  Google: "bg-chart-1/15 text-chart-1 border-chart-1/20",
  Meta: "bg-chart-2/15 text-chart-2 border-chart-2/20",
  TikTok: "bg-chart-3/15 text-chart-3 border-chart-3/20",
}

const statusColors: Record<string, string> = {
  Aktif: "bg-success/15 text-success border-success/20",
  Duraklatildi: "bg-warning/15 text-warning border-warning/20",
  Tamamlandi: "bg-muted text-muted-foreground border-border",
}

export function CampaignTable({ campaigns = [] }: { campaigns?: Campaign[] }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-sm font-medium text-foreground">
          Son Kampanyalar
        </CardTitle>
        <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground">
          Tumunu gor
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Kampanya
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground w-[80px]">
                  Gorsel
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Kampanya
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Platform
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Durum
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Butce
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Sepet
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Donusum
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  ROAS
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="border-border transition-colors hover:bg-accent/50"
                >
                  <TableCell>
                    {campaign.image_url ? (
                      <img 
                        src={campaign.image_url} 
                        alt={campaign.name} 
                        className="h-10 w-12 rounded object-cover border border-border"
                      />
                    ) : (
                      <div className="h-10 w-12 rounded bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                        Yok
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {campaign.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={platformColors[campaign.platform]}
                    >
                      {campaign.platform}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[campaign.status]}
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground">
                    {Number(campaign.budget).toLocaleString()} ₺
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground">
                    {campaign.add_to_cart || 0}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground">
                    {campaign.conversions || 0}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground">
                    {Number(campaign.roas).toFixed(2)}x
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Islemler</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="size-4" />
                          Goruntule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          {campaign.status === "Aktif" ? (
                            <>
                              <Pause className="size-4" />
                              Duraklat
                            </>
                          ) : (
                            <>
                              <Play className="size-4" />
                              Devam Et
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
