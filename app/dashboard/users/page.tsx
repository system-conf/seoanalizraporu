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
        fetch('/api/users'),
        fetch('/api/accounts')
      ])
      
      if (!usersRes.ok || !accountsRes.ok) throw new Error('Veriler yuklenemedi')
      
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

  const handleAssignAccount = async (accountId: number, userId: number | null) => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId, user_id: userId }),
      })

      if (response.ok) {
        setSuccess('Hesap ataması güncellendi')
        fetchData()
      } else {
        throw new Error('Hata oluştu')
      }
    } catch (err) {
      setError('İşlem başarısız')
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
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, full_name: fullName }),
      })

      if (response.ok) {
        setSuccess('Kullanici basariyla eklendi')
        setUsername("")
        setPassword("")
        setFullName("")
        setIsDialogOpen(false)
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || 'Kullanici eklenemedi')
      }
    } catch (err) {
      setError('Bir hata olustu')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Bu kullaniciyi silmek istediginize emin misiniz?')) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setSuccess('Kullanici silindi')
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || 'Kullanici silinemedi')
      }
    } catch (err) {
      setError('Bir hata olustu')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Musteri Yonetimi
          </h1>
          <p className="text-sm text-muted-foreground">
            Musterilere hesap acin ve erisim yetkilerini ayarlayin.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="size-4" />
              Yeni Musteri Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Musteri Ekle</DialogTitle>
              <DialogDescription>
                Musteri bilgilerini girerek yeni bir hesap olusturun.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Ad Soyad</Label>
                  <Input 
                    id="fullName" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Orn: Ahmet Yilmaz" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Kullanici Adi</Label>
                  <Input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="kullanici_adi" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Sifre</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******" 
                    required 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Olustur
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-success/50 bg-success/10 text-success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Basarili</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Kullanici ve Hesap Atamasi</CardTitle>
          <CardDescription>Musterilerin hangi reklam hesaplarini gorebilecegini yonetin.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Kullanici Adi</TableHead>
                <TableHead>Atanan Hesaplar</TableHead>
                <TableHead className="text-right">Islemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-border">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{user.full_name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {allAccounts
                        .filter(acc => acc.user_id === user.id)
                        .map(acc => (
                          <div key={acc.id} className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] text-foreground">
                            {acc.account_name}
                            <button 
                              onClick={() => handleAssignAccount(acc.id, null)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      }
                      {user.role === 'customer' && (
                        <Dialog open={isAssignOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                          setIsAssignOpen(open)
                          if(open) setSelectedUser(user)
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] text-primary">
                              + Ata
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Hesap Ata: {user.full_name}</DialogTitle>
                              <DialogDescription>Musteriye erisim vermek istediginiz hesabi secin.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-2 py-4">
                              {allAccounts
                                .filter(acc => acc.user_id === null || acc.user_id !== user.id)
                                .map(acc => (
                                  <div key={acc.id} className="flex items-center justify-between border-b py-2 last:border-0">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{acc.account_name}</span>
                                      <span className="text-[10px] text-muted-foreground">{acc.platform} - {acc.platform_id}</span>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
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
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={actionLoading || user.role === 'admin'}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
