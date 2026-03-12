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

export default function SettingsPage() {
  const [user, setUser] = useState({ fullName: "", username: "", role: "" })

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
  }, []);

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
              <Select defaultValue="utc+3">
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
              <Select defaultValue="try">
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
              {[
                { label: "E-posta Bildirimleri", description: "Kampanya uyarilarini e-posta ile alin", defaultChecked: true },
                { label: "Haftalik Raporlar", description: "Her Pazartesi ozet rapor alin", defaultChecked: true },
                { label: "Butce Uyarilari", description: "Butce %80'i astiginda uyari", defaultChecked: false },
                { label: "Kampanyalari Otomatik Duraklat", description: "Butce tukendiginde kampanyalari duraklat", defaultChecked: true },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.description}</p>
                  </div>
                  <Switch defaultChecked={pref.defaultChecked} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
