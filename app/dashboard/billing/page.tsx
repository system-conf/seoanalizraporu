"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Check,
  Download,
  Clock
} from "lucide-react"
import { useEffect, useState } from "react"

interface BillingInfo {
  plan_name: string
  plan_price: number
  billing_cycle: string
  payment_method: string | null
  card_last4: string | null
  card_expiry: string | null
  card_holder: string | null
  next_billing_date: string | null
}

interface Invoice {
  id: number
  invoice_id: string
  invoice_date: string
  plan_name: string
  amount: number
  status: string
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBilling()
  }, [])

  const fetchBilling = async () => {
    try {
      const response = await fetch('/api/billing')
      if (response.ok) {
        const data = await response.json()
        setBilling(data.billing)
        setInvoices(data.invoices)
      }
    } catch (err) {
      console.error('Failed to fetch billing:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const getNextBillingDate = () => {
    if (!billing?.next_billing_date) return 'Belirlenmedi'
    const date = new Date(billing.next_billing_date)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Faturalandırma</h1>
          <p className="text-muted-foreground">Abonelik planinizi ve odeme gecmisinizi yonetin.</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

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
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              {billing?.billing_cycle === 'yearly' ? 'Yillik Abonelik' : 'Aylik Abonelik'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-foreground">
                  {billing?.plan_price ? formatAmount(billing.plan_price) : '0 ₺'}
                </span>
                <span className="text-muted-foreground pb-1">
                  /{billing?.billing_cycle === 'yearly' ? 'yil' : 'ay'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Plan:</span>
                <span className="text-sm font-medium text-foreground">{billing?.plan_name || 'Basic Plan'}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Sinirsiz Kampanya</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Ileri Duzey Analitik</span>
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
                <Button variant="outline" className="flex-1 sm:flex-initial border-border">Iptal Et</Button>
              </div>
            </div>
          </CardContent>
          <Separator className="bg-border" />
          <CardContent className="py-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>Bir sonraki fatura: {getNextBillingDate()}</span>
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
            {billing?.card_last4 ? (
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <div className="flex items-start justify-between mb-8">
                  <CreditCard className="size-6 text-primary" />
                  <Badge variant="outline" className="text-[10px] uppercase">Default</Badge>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-sm tracking-widest text-foreground">
                    **** **** **** {billing.card_last4}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{billing.card_holder || 'Kart Sahibi'}</span>
                    <span>{billing.card_expiry || ''}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-center">
                <CreditCard className="size-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Odeme yontemi eklenmedi</p>
              </div>
            )}
            <Button variant="outline" className="w-full border-border bg-background">
              {billing?.card_last4 ? 'Karti Guncelle' : 'Kart Ekle'}
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
            {invoices.length > 0 && (
              <Button variant="outline" size="sm" className="gap-2 border-border">
                <Download className="size-3.5" />
                Tumunu Indir
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {invoices.length > 0 ? (
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
                        <td className="px-6 py-4 font-medium text-foreground">{inv.invoice_id}</td>
                        <td className="px-6 py-4 text-muted-foreground">{formatDate(inv.invoice_date)}</td>
                        <td className="px-6 py-4 text-muted-foreground">{inv.plan_name}</td>
                        <td className="px-6 py-4 text-right font-mono font-medium text-foreground">
                          {formatAmount(inv.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              inv.status === 'Paid'
                                ? 'bg-success/15 text-success border-success/20'
                                : inv.status === 'Pending'
                                ? 'bg-warning/15 text-warning border-warning/20'
                                : 'bg-destructive/15 text-destructive border-destructive/20'
                            }
                          >
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Download className="size-4" />
                            <span className="sr-only">Indir</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Henuz fatura bulunmuyor.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}