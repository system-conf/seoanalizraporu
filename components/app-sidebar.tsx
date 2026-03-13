"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Link2,
  Megaphone,
  PlusCircle,
  FileBarChart,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.user?.role === 'admin');
          setPermissions(data.user?.permissions || {});
        }
      } catch (e) {}
    };
    checkAuth();
  }, []);

  const navItems = [
    { label: "Kontrol Paneli", href: "/dashboard", icon: LayoutDashboard, key: 'dashboard' },
    { label: "Hesaplar", href: "/dashboard/accounts", icon: Link2, key: 'accounts' },
    { label: "Kampanyalar", href: "/dashboard/campaigns", icon: Megaphone, key: 'campaigns' },
    { label: "Kampanya Olustur", href: "/dashboard/campaigns/create", icon: PlusCircle, key: 'campaigns' },
    { label: "Raporlar", href: "/dashboard/reports", icon: FileBarChart, key: 'reports' },
    { label: "Analitik", href: "/dashboard/analytics", icon: BarChart3, key: 'analytics' },
    ...(isAdmin ? [
      { label: "Musteri Yonetimi", href: "/dashboard/users", icon: Users, key: 'users' },
      { label: "Ekip Yonetimi", href: "/dashboard/team", icon: Users, key: 'team' }
    ] : []),
    { label: "Ayarlar", href: "/dashboard/settings", icon: Settings, key: 'settings' },
  ].filter(item => {
    // Admins see everything, customers see based on permissions
    if (isAdmin) return true;
    return permissions[item.key] !== false; // Explicitly hidden if false, default true if not set (or better: check if true)
    // Actually, following the "disabled by default" or "enabled by default" logic:
    // Our migration set everyone to true.
  })

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (e) {
      console.error('Logout failed');
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="size-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          En İyi SEO Hizmeti
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          Cikis Yap
        </button>
      </div>
    </aside>
  )
}
