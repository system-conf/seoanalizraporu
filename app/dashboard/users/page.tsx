"use client"

import { useEffect, useState } from "react"
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [allAccounts, setAllAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // New user form state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const fetchData = async () => {
    try {
      const [usersRes, accountsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/accounts")
      ])
      
      if (!usersRes.ok || !accountsRes.ok) throw new Error("Veriler yuklenemedi")
      
      const [usersData, accountsData] = await Promise.all([
        usersRes.json(),
        accountsRes.json()
      ])
      
      setUsers(usersData)
      setAllAccounts(accountsData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  const handleAssignAccount = async (accountId: number, userId: number | null) => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/accounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId, user_id: userId }),
      })

      if (response.ok) {
        setSuccess("Hesap atamasi guncellendi")
        fetchData()
      } else {
        throw new Error("Hata olustu")
      }
    } catch (err) {
      setError("Islem basarisiz")
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, full_name: fullName }),
      })

      if (response.ok) {
        setSuccess("Kullanici basariyla eklendi")
        setUsername("")
        setPassword("")
        setFullName("")
        setIsDialogOpen(false)
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || "Kullanici eklenemedi")
      }
    } catch (err) {
      setError("Bir hata olustu")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Bu kullaniciyi silmek istediginize emin misiniz?")) return

    setActionLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setSuccess("Kullanici silindi")
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || "Kullanici silinemedi")
      }
    } catch (err) {
      setError("Bir hata olustu")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Yukleniyor...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Musteri Yonetimi
          </h1>
          <p className="text-muted-foreground">
            Musterilerinize özel erisim yetkileri tanyin ve hesap atayin.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <UserPlus className="size-4" />
              Yeni Musteri Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yeni Musteri Hesabi</DialogTitle>
              <DialogDescription>
                Musteriniz icin giris bilgilerini olusturun.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input 
                  id="fullName" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ahmet Yilmaz" 
                  required 
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Kullanici Adi</Label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ahmet_yilmaz" 
                  required 
                  className="bg-secondary/50 text-lowercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Sifre</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  className="bg-secondary/50"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Hesap Olustur
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {error && (
          <Alert variant="destructive" className="w-80 shadow-2xl animate-in slide-in-from-bottom-5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="w-80 border-success/50 bg-success/10 text-success shadow-2xl animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Basarili</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>

      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg">Kullanici Listesi</CardTitle>
          <CardDescription>Sistemdeki tüm admin ve müsteri hesaplari.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[200px]">Ad Soyad</TableHead>
                  <TableHead>Kullanici Adi</TableHead>
                  <TableHead>Atanan Hesaplar</TableHead>
                  <TableHead className="text-right">Islemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-border group">
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <span className="text-foreground">{user.full_name}</span>
                        <div className="flex items-center gap-1.5">
                          {user.role === "admin" ? (
                            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                              <ShieldCheck className="size-3" />
                              Admin
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                              <Shield className="size-3" />
                              Musteri
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.username}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {allAccounts
                          .filter(acc => acc.user_id === user.id)
                          .map(acc => (
                            <div key={acc.id} className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 pl-2 pr-1 py-1 text-xs text-foreground group">
                              {acc.account_name}
                              <button 
                                onClick={() => handleAssignAccount(acc.id, null)}
                                className="flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                title="Atamayi Kaldir"
                              >
                                ×
                              </button>
                            </div>
                          ))
                        }
                        {user.role === "customer" && (
                          <Dialog open={isAssignOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                            setIsAssignOpen(open)
                            if(open) setSelectedUser(user)
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 gap-1.5 rounded-md border border-dashed border-border px-2 text-xs text-primary hover:bg-primary/5 hover:text-primary">
                                <UserPlus className="size-3" />
                                Hesap Ata
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Hesap Ata: {user.full_name}</DialogTitle>
                                <DialogDescription>Bu müsterinin erisim saglayabilecegi platform hesaplarini secin.</DialogDescription>
                              </DialogHeader>
                              <div className="max-h-[300px] overflow-y-auto pr-2 pt-4">
                                <div className="grid gap-2">
                                  {allAccounts
                                    .filter(acc => acc.user_id === null || acc.user_id !== user.id)
                                    .map(acc => (
                                      <div key={acc.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary">
                                        <div className="flex flex-col gap-0.5">
                                          <span className="text-sm font-semibold">{acc.account_name}</span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-muted-foreground uppercase">{acc.platform}</span>
                                            <span className="text-[10px] text-muted-foreground">•</span>
                                            <span className="text-[10px] text-muted-foreground">{acc.platform_id}</span>
                                          </div>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          className="h-8 shadow-sm"
                                          onClick={() => {
                                            handleAssignAccount(acc.id, user.id);
                                            setIsAssignOpen(false);
                                          }}
                                        >
                                          Ata
                                        </Button>
                                      </div>
                                    ))
                                  }
                                  {allAccounts.filter(acc => acc.user_id === null || acc.user_id !== user.id).length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                      <AlertCircle className="size-8 text-muted-foreground/30 mb-2" />
                                      <p className="text-sm text-muted-foreground">Atanabilir musait hesap bulunmadi.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground group-hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={actionLoading || user.role === "admin"}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
