"use client"

import { Bell, ChevronDown } from "lucide-react"
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

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
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
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/20 text-xs text-primary">
                  AY
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">Ahmet Yilmaz</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Faturalama</DropdownMenuItem>
            <DropdownMenuItem>Ekip</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Cikis Yap</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
