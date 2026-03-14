"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface NotificationSettings {
  emailNotifications: boolean
  weeklyReports: boolean
  budgetAlerts: boolean
  autoPauseCampaigns: boolean
}

export default function SettingsPage() {
  const [user, setUser] = useState({ fullName: "", username: "", role: "" })
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    weeklyReports: true,
    budgetAlerts: false,
    autoPauseCampaigns: true,
  })
  const [timezone, setTimezone] = useState("utc+3")
  const [currency, setCurrency] = useState("try")

  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_session='))
      ?.split('=')[1];

    if (cookieValue) {
      try {
        const session = JSON.parse(decodeURIComponent(cookieValue));
        setUser({
          fullName: session.full_name || "",
          username: session.username || "",
          role: session.role || ""
        });
      } catch (e) {}
    }

    // Fetch user preferences
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        if (data.notifications) {
          setNotifications(data.notifications)
        }
        if (data.timezone) {
          setTimezone(data.timezone)
        }
        if (data.currency) {
          setCurrency(data.currency)
        }
      }
    } catch (err) {
      // Use defaults
    }
  }

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications, timezone, currency })
      })

      if (!response.ok) throw new Error('Tercihler kaydedilemedi')
      toast.success('Tercihler kaydedildi')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">
          Hesap ve uygulama tercihlerinizi yonetin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-foreground">Ad Soyad</Label>
              <Input
                id="name"
                value={user.fullName}
                readOnly
                className="border-border bg-secondary text-foreground opacity-70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-foreground">Kullanici Adi</Label>
              <Input
                id="username"
                value={user.username}
                readOnly
                className="border-border bg-secondary text-foreground opacity-70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="role" className="text-foreground">Yetki Seviyesi</Label>
              <Input
                id="role"
                value={user.role === 'admin' ? 'Yonetici' : 'Musteri'}
                readOnly
                className="border-border bg-secondary text-foreground opacity-70 uppercase"
              />
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              * Profil bilgileri su an icin sadece okunabilirdir.
            </p>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Tercihler</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Saat Dilimi</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="border-border bg-secondary text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc+3">Turkiye Saati (UTC+3)</SelectItem>
                  <SelectItem value="utc+1">Orta Avrupa (UTC+1)</SelectItem>
                  <SelectItem value="utc+0">UTC</SelectItem>
                  <SelectItem value="utc-5">Dogu Amerika (UTC-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Para Birimi</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="border-border bg-secondary text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="try">TRY</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-border" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">E-posta Bildirimleri</p>
                  <p className="text-xs text-muted-foreground">Kampanya uyarilarini e-posta ile alin</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(v) => updateNotification('emailNotifications', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Haftalik Raporlar</p>
                  <p className="text-xs text-muted-foreground">Her Pazartesi ozet rapor alin</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(v) => updateNotification('weeklyReports', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Butce Uyarilari</p>
                  <p className="text-xs text-muted-foreground">Butce %80'i astiginda uyari</p>
                </div>
                <Switch
                  checked={notifications.budgetAlerts}
                  onCheckedChange={(v) => updateNotification('budgetAlerts', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Kampanyalari Otomatik Duraklat</p>
                  <p className="text-xs text-muted-foreground">Butce tukendiginde kampanyalari duraklat</p>
                </div>
                <Switch
                  checked={notifications.autoPauseCampaigns}
                  onCheckedChange={(v) => updateNotification('autoPauseCampaigns', v)}
                />
              </div>
            </div>

            <Separator className="bg-border" />

            <Button onClick={handleSavePreferences} disabled={saving} className="w-full">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tercihleri Kaydet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}