"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Receipt, 
  ArrowUpRight, 
  Check, 
  Download, 
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react"

const invoices = [
  { id: "INV-2024-001", date: "01 Mar 2024", amount: "4.500,00 ₺", status: "Paid", plan: "Professional Plan" },
  { id: "INV-2024-002", date: "01 Sub 2024", amount: "4.500,00 ₺", status: "Paid", plan: "Professional Plan" },
  { id: "INV-2024-003", date: "01 Oca 2024", amount: "2.900,00 ₺", status: "Paid", plan: "Basic Plan" },
]

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Faturalandırma</h1>
        <p className="text-muted-foreground">Abonelik planinizi ve odeme gecmisinizi yonetin.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Plan */}
        <Card className="border-border bg-card shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-lg">Guncel Plan</CardTitle>
              <CardDescription>Su anki abonelik detaylariniz.</CardDescription>
            </div>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Aylik Abonelik</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-foreground">4.500 ₺</span>
                <span className="text-muted-foreground pb-1">/ay</span>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Sınırsız Kampanya</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">İleri Duzey Analitik</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Gunluk Raporlama</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">VIP Destek</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1 sm:flex-initial">Plani Yukselt</Button>
                <Button variant="outline" className="flex-1 sm:flex-initial border-border">İptal Et</Button>
              </div>
            </div>
          </CardContent>
          <Separator className="bg-border" />
          <CardContent className="py-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>Bir sonraki fatura: 1 Nisan 2024</span>
              </div>
              <Button variant="link" className="h-auto p-0 text-primary">Detaylar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="border-border bg-card shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Odeme Yontemi</CardTitle>
            <CardDescription>Varsayilan odeme kartiniz.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-secondary/50 p-4">
              <div className="flex items-start justify-between mb-8">
                <CreditCard className="size-6 text-primary" />
                <Badge variant="outline" className="text-[10px] uppercase">Default</Badge>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-sm tracking-widest text-foreground">**** **** **** 4242</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Ahmet Yılmaz</span>
                  <span>12/26</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full border-border bg-background">
              Karti Guncelle
            </Button>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card className="border-border bg-card shadow-sm lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg">Fatura Gecmisi</CardTitle>
              <CardDescription>Gecmis faturalarinizi indirin ve goruntuleyin.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2 border-border">
              <Download className="size-3.5" />
              Tumunu İndir
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-muted/30 text-muted-foreground">
                    <th className="px-6 py-3 text-left font-medium">Fatura ID</th>
                    <th className="px-6 py-3 text-left font-medium">Tarih</th>
                    <th className="px-6 py-3 text-left font-medium">Plan</th>
                    <th className="px-6 py-3 text-right font-medium">Tutar</th>
                    <th className="px-6 py-3 text-center font-medium">Durum</th>
                    <th className="px-6 py-3 text-right font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="transition-colors hover:bg-accent/50">
                      <td className="px-6 py-4 font-medium text-foreground">{inv.id}</td>
                      <td className="px-6 py-4 text-muted-foreground">{inv.date}</td>
                      <td className="px-6 py-4 text-muted-foreground">{inv.plan}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-foreground">{inv.amount}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className="bg-success/15 text-success border-success/20">
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Download className="size-4" />
                          <span className="sr-only">İndir</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
