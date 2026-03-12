"use client"

import Link from "next/link"
import { Bell, ChevronDown, User, CreditCard, Users, LogOut } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter()
  const [user, setUser] = useState({ fullName: "", initials: "AY" })

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
        setUser({ fullName, initials });
      } catch (e) {}
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (e) {
      console.error('Logout failed');
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Existing Selects ... (Keep them but I'll only show the relevant part in replacement) */}
        <Select defaultValue="main">
          <SelectTrigger className="w-48 border-border bg-secondary">
            <SelectValue placeholder="Hesap secin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">AdControl Ana Hesap</SelectItem>
            <SelectItem value="secondary">Business Suite Pro</SelectItem>
            <SelectItem value="tiktok">TikTok Business</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary p-1">
          {["Tumu", "Google", "Meta", "TikTok"].map((platform) => (
            <button
              key={platform}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                platform === "Tumu"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        <Select defaultValue="30d">
          <SelectTrigger className="w-36 border-border bg-secondary">
            <SelectValue placeholder="Tarih araligi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Son 7 gun</SelectItem>
            <SelectItem value="30d">Son 30 gun</SelectItem>
            <SelectItem value="90d">Son 90 gun</SelectItem>
            <SelectItem value="ytd">Yil basinda bu yana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
          <span className="sr-only">Bildirimler</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent focus:outline-none">
              <Avatar className="size-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-semibold text-foreground">{user.fullName}</span>
                <span className="text-[10px] text-muted-foreground">AdControl Pro</span>
              </div>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-border bg-card p-1 shadow-2xl">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Hesabim</div>
            <Link href="/dashboard/profile" className="w-full">
              <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer">
                <User className="size-4 text-primary" />
                <span>Profil</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/billing" className="w-full">
              <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer">
                <CreditCard className="size-4 text-chart-4" />
                <span>Faturalandırma</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/team" className="w-full">
              <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer">
                <Users className="size-4 text-chart-2" />
                <span>Ekip</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Cikis Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
