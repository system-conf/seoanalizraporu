"use client"

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Megaphone,
  DollarSign,
  Clock,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function MetaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11v-3.5a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.22a8.16 8.16 0 0 0 4.76 1.51v-3.45a4.82 4.82 0 0 1-1-.59z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [addAccountDialog, setAddAccountDialog] = useState<string | null>(null) // platform name
  const [deleteAccount, setDeleteAccount] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Form states
  const [accountName, setAccountName] = useState("")
  const [externalAccountId, setExternalAccountId] = useState("")

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      if (!response.ok) throw new Error('Hesaplar yuklenemedi')
      const data = await response.json()
      setAccounts(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleAddAccount = async () => {
    if (!addAccountDialog || !accountName || !externalAccountId) {
      toast.error('Lutfen tum alanlari doldurun')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: addAccountDialog,
          account_name: accountName,
          external_account_id: externalAccountId
        })
      })
      if (!response.ok) throw new Error('Hesap eklenemedi')
      toast.success('Hesap basariyla eklendi')
      setAddAccountDialog(null)
      setAccountName("")
      setExternalAccountId("")
      fetchAccounts()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deleteAccount) return

    setSaving(true)
    try {
      const response = await fetch('/api/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteAccount.id })
      })
      if (!response.ok) throw new Error('Hesap silinemedi')
      toast.success('Hesap basariyla silindi')
      setDeleteAccount(null)
      fetchAccounts()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSync = (account: any) => {
    toast.info(`${account.account_name} senkronize ediliyor...`)
  }

  const handleOpen = (account: any) => {
    if (account.external_account_id) {
      const url = account.platform === 'Google'
        ? `https://ads.google.com/aw/accounts?__c=${account.external_account_id}`
        : account.platform === 'Meta'
        ? `https://business.facebook.com/adsmanager/manage/accounts?act=${account.external_account_id}`
        : `https://ads.tiktok.com/i18n/dashboard?aadvid=${account.external_account_id}`
      window.open(url, '_blank')
    } else {
      toast.info('Hesap ID bulunamadi')
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Hesaplar yukleniyor...</span>
      </div>
    )
  }

  // Count accounts by platform
  const googleCount = accounts.filter(a => a.platform === 'Google').length
  const metaCount = accounts.filter(a => a.platform === 'Meta').length
  const tiktokCount = accounts.filter(a => a.platform === 'TikTok').length

  const platforms = [
    { name: "Google", displayName: "Google Ads", icon: GoogleIcon, connected: googleCount > 0, count: googleCount },
    { name: "Meta", displayName: "Meta Ads", icon: MetaIcon, connected: metaCount > 0, count: metaCount },
    { name: "TikTok", displayName: "TikTok Ads", icon: TikTokIcon, connected: tiktokCount > 0, count: tiktokCount },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Bagli Hesaplar
        </h1>
        <p className="text-sm text-muted-foreground">
          Reklam platformu baglantilarinizi yonetin.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Connect buttons */}
      <div className="grid gap-4 sm:grid-cols-3">
        {platforms.map((platform) => (
          <Card
            key={platform.name}
            className="border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <platform.icon className="size-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{platform.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {platform.connected ? `${platform.count} Hesap bagli` : "Bagli degil"}
                </p>
              </div>
              <Button
                variant={platform.connected ? "outline" : "default"}
                size="sm"
                onClick={() => setAddAccountDialog(platform.name)}
                className={
                  platform.connected
                    ? "border-border text-muted-foreground hover:text-foreground"
                    : "bg-primary text-primary-foreground"
                }
              >
                {platform.connected ? "Yonet" : "Bagla"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connected account cards */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Hesap Detaylari</h2>
        {accounts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground text-sm">Henüz hesap baglamadiniz.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {accounts.map((account) => {
              const PlatformIcon = account.platform === 'Google' ? GoogleIcon : (account.platform === 'Meta' ? MetaIcon : TikTokIcon)
              return (
                <Card
                  key={account.id}
                  className="border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                          <PlatformIcon className="size-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {account.account_name}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {account.external_account_id}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-success/15 text-success border-success/20">
                        <CheckCircle2 className="mr-1 size-3" />
                        Bagli
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(account)}
                        className="flex-1 gap-2 border-border text-muted-foreground hover:text-foreground"
                      >
                        <RefreshCw className="size-3" />
                        Senkronize Et
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpen(account)}
                        className="flex-1 gap-2 border-border text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="size-3" />
                        Ac
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteAccount(account)}
                        className="gap-2 border-border text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Account Dialog */}
      <Dialog open={!!addAccountDialog} onOpenChange={() => setAddAccountDialog(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hesap Ekle</DialogTitle>
            <DialogDescription>
              {addAccountDialog && platforms.find(p => p.name === addAccountDialog)?.displayName} hesabi ekleyin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="accountName">Hesap Adi</Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Ornek: Ana Hesap"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="externalId">Hesap ID</Label>
              <Input
                id="externalId"
                value={externalAccountId}
                onChange={(e) => setExternalAccountId(e.target.value)}
                placeholder="Ornek: 1234567890"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAccountDialog(null)}>Iptal</Button>
            <Button onClick={handleAddAccount} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteAccount} onOpenChange={() => setDeleteAccount(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hesabi Sil</DialogTitle>
            <DialogDescription>
              Bu islem geri alinamaz. "{deleteAccount?.account_name}" hesabini silmek istediginizden emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAccount(null)}>Iptal</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}