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
  ChevronDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const teamMembers = [
  { id: 1, name: "Ahmet Yılmaz", role: "Owner", email: "ahmet@lilidea.com.tr", status: "Active", lastActive: "Just now", initials: "AY" },
  { id: 2, name: "Zeynep Kaya", role: "Admin", email: "zeynep@lilidea.com.tr", status: "Active", lastActive: "2 hours ago", initials: "ZK" },
  { id: 3, name: "Can Demir", role: "Editor", email: "can@lilidea.com.tr", status: "Inactive", lastActive: "3 days ago", initials: "CD" },
  { id: 4, name: "Elif Sahin", role: "Viewer", email: "elif@lilidea.com.tr", status: "Active", lastActive: "5 mins ago", initials: "ES" },
]

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Ekip</h1>
          <p className="text-muted-foreground">Ekip uyelerini ve yetkilerini yonetin.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="size-4" />
          Uye Davet Et
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Toplam Uye", value: "12", icon: Users, color: "text-primary" },
            { label: "Yoneticiler", value: "3", icon: Shield, color: "text-chart-4" },
            { label: "Aktif Uyeler", value: "8", icon: Clock, color: "text-chart-2" },
            { label: "Bekleyen Davetler", value: "0", icon: Mail, color: "text-muted-foreground" },
          ].map((stat, i) => (
            <Card key={i} className="border-border bg-card shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
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
                  {teamMembers.map((member) => (
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
                            <span className="text-xs text-muted-foreground">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-normal text-xs bg-secondary">
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
                            <DropdownMenuItem className="gap-2">
                              <ExternalLink className="size-3.5" />
                              Goruntule
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Shield className="size-3.5" />
                              Yetki Degistir
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
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
            <span className="text-xs text-muted-foreground">Toplam 12 uyeden 1-4 arasi gosteriliyor</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs disabled:opacity-50" disabled>Onceki</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">Sonraki</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
