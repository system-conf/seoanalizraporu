"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, Bell, Key, Smartphone } from "lucide-react"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const [user, setUser] = useState({ fullName: "", username: "", role: "", initials: "AY" })

  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_session='))
      ?.split('=')[1];
    
    if (cookieValue) {
      try {
        const session = JSON.parse(decodeURIComponent(cookieValue));
        const fullName = session.full_name || "Kullanici";
        const initials = fullName
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
        setUser({ 
          fullName, 
          username: session.username || "",
          role: session.role || "",
          initials
        });
      } catch (e) {}
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profil</h1>
        <p className="text-muted-foreground">Kisisel bilgilerinizi ve guvenlik tercihlerini yonetin.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Avatar & Basic Info */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="pt-8 text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 border-4 border-secondary shadow-xl">
                  <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-xl font-bold text-foreground">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground mb-4">@{user.username}</p>
              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {user.role === 'admin' ? 'Yonetici' : 'Musteri'}
                </Badge>
                <Badge variant="outline" className="bg-success/5 text-success border-success/20">Aktif</Badge>
              </div>
            </CardContent>
            <Separator className="bg-border" />
            <CardContent className="py-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-foreground">{user.username}@lilidea.com.tr</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="size-4 text-muted-foreground" />
                  <span className="text-foreground">Guvenlik: Yuksek</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Hesap Durumu</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Profil Tamamlanma</span>
                  <span className="text-foreground">85%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 w-[85%] rounded-full bg-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Tum özellikleri kullanabilmek icin telefon numaranizi dogrulayin.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings Sections */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Information Section */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5 text-primary" />
                Kisisel Bilgiler
              </CardTitle>
              <CardDescription>Hesap kimlik bilgilerinizi buradan guncelleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad Soyad</Label>
                  <Input id="firstName" defaultValue={user.fullName} className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" defaultValue={`${user.username}@lilidea.com.tr`} className="bg-secondary/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Hakkinda</Label>
                <textarea 
                  id="bio"
                  className="w-full rounded-md border border-border bg-secondary/50 p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                  defaultValue="Digital marketing professional."
                />
              </div>
              <div className="flex justify-end">
                <Button>Degisikleri Kaydet</Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="size-5 text-chart-4" />
                Sifre ve Guvenlik
              </CardTitle>
              <CardDescription>Sifrenizi degistirin ve iki faktorlu dogrulamayi aktif edin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Sifre</p>
                    <p className="text-xs text-muted-foreground">Son degistirme: 3 ay once</p>
                  </div>
                  <Button variant="outline" size="sm">Sifre Guncelle</Button>
                </div>
                <Separator className="bg-border" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="size-4 text-muted-foreground" />
                      <p className="text-sm font-medium">İki Faktorlu Dogrulama (2FA)</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Hesabinizi ek bir guvenlik katmaniyla koruyun.</p>
                  </div>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5">Pasif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Section */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5 text-chart-2" />
                Bildirim Tercihleri
              </CardTitle>
              <CardDescription>Hangi bildirimleri almak istediginizi secin.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Yeni Raporlar", desc: "Yeni bir analiz raporu olusturuldugunda bildir." },
                  { title: "Sistem Duyurulari", desc: "Platform guncellemeleri hakkinda haber ver." },
                  { title: "Performans Uyarıları", desc: "Kampanya performansi dustugunde anlik uyar." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <div className="flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full bg-primary/20 p-1 transition-colors duration-200">
                      <div className="h-4 w-4 transform rounded-full bg-primary transition duration-200 translate-x-5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
