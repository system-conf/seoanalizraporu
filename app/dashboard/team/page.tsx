"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  UserPlus,
  MoreVertical,
  Shield,
  Mail,
  Clock,
  ExternalLink,
  ChevronDown,
  Loader2,
  AlertCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export default function TeamPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [inviteDialog, setInviteDialog] = useState(false)
  const [viewMember, setViewMember] = useState<any>(null)
  const [roleMember, setRoleMember] = useState<any>(null)
  const [deleteMember, setDeleteMember] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Form states
  const [inviteUsername, setInviteUsername] = useState("")
  const [invitePassword, setInvitePassword] = useState("")
  const [inviteFullName, setInviteFullName] = useState("")
  const [inviteRole, setInviteRole] = useState("customer")
  const [selectedRole, setSelectedRole] = useState("")

  const fetchData = async () => {
    try {
      const response = await fetch('/api/team')
      if (!response.ok) {
        if (response.status === 403) throw new Error('Bu sayfayi goruntuleme yetkiniz yok.')
        throw new Error('Ekip verileri yuklenemedi')
      }
      const result = await response.json()
      setData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleInvite = async () => {
    if (!inviteUsername || !invitePassword || !inviteFullName) {
      toast.error('Lutfen tum alanlari doldurun')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: inviteUsername,
          password: invitePassword,
          full_name: inviteFullName,
          role: inviteRole
        })
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Uye eklenemedi')
      }
      toast.success('Uye basariyla eklendi')
      setInviteDialog(false)
      setInviteUsername("")
      setInvitePassword("")
      setInviteFullName("")
      setInviteRole("customer")
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRoleChange = async () => {
    if (!roleMember || !selectedRole) return

    setSaving(true)
    try {
      const response = await fetch('/api/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: roleMember.id,
          role: selectedRole
        })
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Rol guncellenemedi')
      }
      toast.success('Rol basariyla guncellendi')
      setRoleMember(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteMember) return

    setSaving(true)
    try {
      const response = await fetch('/api/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteMember.id })
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Uye silinemedi')
      }
      toast.success('Uye ekipten cikarildi')
      setDeleteMember(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Ekip yukleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users
      case 'Shield': return Shield
      case 'Clock': return Clock
      case 'Mail': return Mail
      default: return Users
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Ekip</h1>
          <p className="text-muted-foreground">Ekip uyelerini ve yetkilerini yonetin.</p>
        </div>
        <Button className="gap-2" onClick={() => setInviteDialog(true)}>
          <UserPlus className="size-4" />
          Uye Davet Et
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.stats.map((stat: any, i: number) => {
            const Icon = getIcon(stat.icon)
            return (
              <Card key={i} className="border-border bg-card shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Team Table */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3 px-6">
            <CardTitle className="text-lg">Ekip Uyeleri</CardTitle>
            <CardDescription>Tum ekip uyelerinin listesi ve yetki seviyeleri.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-muted/30 text-muted-foreground">
                    <th className="px-6 py-3 text-left font-medium">Uye</th>
                    <th className="px-6 py-3 text-left font-medium">Rol</th>
                    <th className="px-6 py-3 text-left font-medium">Durum</th>
                    <th className="px-6 py-3 text-left font-medium">Son Gorulme</th>
                    <th className="px-6 py-3 text-right font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.members.map((member: any) => (
                    <tr key={member.id} className="transition-colors hover:bg-accent/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border border-border">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{member.name}</span>
                            <span className="text-xs text-muted-foreground">{member.email || member.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-normal text-xs bg-secondary uppercase">
                          {member.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`size-1.5 rounded-full ${member.status === 'Active' ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-muted-foreground/30'}`} />
                          <span className="text-xs text-muted-foreground">{member.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {member.lastActive}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="gap-2" onClick={() => setViewMember(member)}>
                              <ExternalLink className="size-3.5" />
                              Goruntule
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => {
                              setRoleMember(member)
                              setSelectedRole(member.role)
                            }}>
                              <Shield className="size-3.5" />
                              Yetki Degistir
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => setDeleteMember(member)}>
                              Ekipten Cikar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/10">
            <span className="text-xs text-muted-foreground">Toplam {data.members.length} uyeden {data.members.length} arasi gosteriliyor</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs disabled:opacity-50" disabled>Onceki</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs disabled:opacity-50" disabled>Sonraki</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Uye Davet Et</DialogTitle>
            <DialogDescription>
              Yeni bir ekip uyeleri ekleyin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                value={inviteFullName}
                onChange={(e) => setInviteFullName(e.target.value)}
                placeholder="Ornek: Ahmet Yilmaz"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Kullanici Adi</Label>
              <Input
                id="username"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                placeholder="Ornek: ahmetyilmaz"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Sifre</Label>
              <Input
                id="password"
                type="password"
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                placeholder="********"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Yonetici</SelectItem>
                  <SelectItem value="customer">Musteri</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialog(false)}>Iptal</Button>
            <Button onClick={handleInvite} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Member Dialog */}
      <Dialog open={!!viewMember} onOpenChange={() => setViewMember(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Uye Detaylari</DialogTitle>
            <DialogDescription>
              {viewMember?.name} uyesinin bilgileri
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border border-border">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {viewMember?.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{viewMember?.name}</p>
                <p className="text-sm text-muted-foreground">{viewMember?.email || viewMember?.username}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Rol</Label>
                <p className="font-medium uppercase">{viewMember?.role}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Durum</Label>
                <p className="font-medium">{viewMember?.status}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Son Gorulme</Label>
                <p className="font-medium">{viewMember?.lastActive}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={!!roleMember} onOpenChange={() => setRoleMember(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yetki Degistir</DialogTitle>
            <DialogDescription>
              {roleMember?.name} uyesinin yetkisini degistirin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Yeni Rol</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Yonetici</SelectItem>
                  <SelectItem value="customer">Musteri</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleMember(null)}>Iptal</Button>
            <Button onClick={handleRoleChange} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteMember} onOpenChange={() => setDeleteMember(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ekipten Cikar</DialogTitle>
            <DialogDescription>
              Bu islem geri alinamaz. "{deleteMember?.name}" uyesini ekipten cikarmak istediginizden emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteMember(null)}>Iptal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cikar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}