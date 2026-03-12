"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Key, 
  Smartphone, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  const [user, setUser] = useState({ fullName: "", username: "", role: "", email: "", phone: "", bio: "", initials: "AY" })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form states
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile")
      if (!res.ok) throw new Error("Profil yuklenemedi")
      const data = await res.json()
      
      const initials = (data.full_name || "K")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)

      setUser({ 
        fullName: data.full_name || "", 
        username: data.username || "",
        role: data.role || "",
        email: data.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        initials
      })
      
      setFullName(data.full_name || "")
      setEmail(data.email || "")
      setPhone(data.phone || "")
      setBio(data.bio || "")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  const handleUpdateProfile = async () => {
    setActionLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, phone, bio }),
      })

      if (res.ok) {
        setSuccess("Profil guncellendi")
        fetchProfile()
      } else {
        throw new Error("Guncelleme basarisiz")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const meRes = await fetch("/api/auth/me")
      const meData = await meRes.json()
      
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: meData.user.id, password: newPassword }),
      })

      if (res.ok) {
        setSuccess("Sifre guncellendi")
        setNewPassword("")
        setIsPasswordDialogOpen(false)
        setShowNewPassword(false)
      } else {
        throw new Error("Sifre guncellenemedi")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Profil yukleniyor...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profil Ayarlari</h1>
          <p className="text-muted-foreground">Kisisel bilgilerinizi ve guvenlik tercihlerinizi buradan yonetin.</p>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive shadow-2xl animate-in slide-in-from-bottom-5">
            <AlertCircle className="size-5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold">Hata</span>
              <span className="text-xs">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 rounded-lg border border-success/50 bg-success/10 px-4 py-3 text-success shadow-2xl animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="size-5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold">Basarili</span>
              <span className="text-xs">{success}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="pt-8 text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 border-4 border-secondary shadow-xl transition-transform hover:scale-105">
                  <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-xl font-bold text-foreground">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground mb-4">@{user.username}</p>
              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize font-bold">
                  {user.role}
                </Badge>
                <Badge variant="outline" className="bg-success/5 text-success border-success/20 font-bold">Aktif</Badge>
              </div>
            </CardContent>
            <Separator className="bg-border" />
            <CardContent className="py-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-secondary/50">
                    <Mail className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">E-posta</span>
                    <span className="text-foreground font-medium">{user.email || 'Belirtilmedi'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-secondary/50">
                    <Smartphone className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Telefon</span>
                    <span className="text-foreground font-medium">{user.phone || 'Belirtilmedi'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-3 bg-muted/30">
              <CardTitle className="text-sm font-semibold">Hesap Durumu</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Profil Tamamlanma</span>
                  <span className="text-foreground">85%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-2 w-[85%] rounded-full bg-primary transition-all" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Information Section */}
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <User className="size-4 text-primary" />
                </div>
                Kisisel Bilgiler
              </CardTitle>
              <CardDescription>Hesap kimlik bilgilerinizi buradan guncelleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs font-bold uppercase text-muted-foreground">Ad Soyad</Label>
                  <Input 
                    id="fullName" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-secondary/50 focus:bg-background transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground">E-posta</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary/50 focus:bg-background transition-colors" 
                  />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase text-muted-foreground">Telefon</Label>
                  <Input 
                    id="phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 5xx xxx xx xx"
                    className="bg-secondary/50 focus:bg-background transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs font-bold uppercase text-muted-foreground">Kullanici Adi</Label>
                  <Input id="username" value={user.username} disabled className="bg-muted text-muted-foreground cursor-not-allowed" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-bold uppercase text-muted-foreground">Hakkinda</Label>
                <textarea 
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary/50 p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                  rows={4}
                />
              </div>
              <div className="flex justify-end border-t border-border pt-6">
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={actionLoading}
                  className="px-8 shadow-lg shadow-primary/20"
                >
                  {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Degisikleri Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex size-8 items-center justify-center rounded-lg bg-chart-4/10">
                  <Key className="size-4 text-chart-4" />
                </div>
                Sifre ve Guvenlik
              </CardTitle>
              <CardDescription>Hesap guvenliginizi kontrol altinda tutun.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Giris Sifresi</p>
                  <p className="text-xs text-muted-foreground">Hesabiniza erismek icin kullandiginiz anahtar.</p>
                </div>
                
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 font-bold hover:bg-chart-4/10 hover:text-chart-4 hover:border-chart-4/50">
                      <KeyRound className="size-4" />
                      Sifre Guncelle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Sifrenizi Guncelleyin</DialogTitle>
                      <DialogDescription>Yeni sifrenizle tum cihazlardan tekrar giris yapmaniz gerekebilir.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdatePassword} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Yeni Sifre</Label>
                        <div className="relative">
                          <Input 
                            id="newPassword" 
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••" 
                            required 
                            className="bg-secondary/50 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>
                      <DialogFooter className="pt-2">
                        <Button type="submit" className="w-full" disabled={actionLoading}>
                          {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Yeni Sifreyi Kaydet
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-muted-foreground" />
                    <p className="text-sm font-bold">İki Faktorlu Dogrulama (2FA)</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Ekstra bir guvenlik katmani ekleyin.</p>
                </div>
                <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5 font-bold">Yakinda</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
