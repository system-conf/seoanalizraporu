"use client"

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Megaphone,
  DollarSign,
  Clock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { connectedAccounts } from "@/lib/mock-data"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function MetaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11v-3.5a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.22a8.16 8.16 0 0 0 4.76 1.51v-3.45a4.82 4.82 0 0 1-1-.59z"
        fill="currentColor"
      />
    </svg>
  )
}

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
  "Google Ads": GoogleIcon,
  "Meta Ads": MetaIcon,
  "TikTok Ads": TikTokIcon,
}

const statusConfig: Record<string, { icon: React.FC<{ className?: string }>; color: string }> = {
  "Bagli": {
    icon: CheckCircle2,
    color: "bg-success/15 text-success border-success/20",
  },
  "Token Sona Eriyor": {
    icon: AlertTriangle,
    color: "bg-warning/15 text-warning border-warning/20",
  },
  "Hata": {
    icon: XCircle,
    color: "bg-destructive/15 text-destructive border-destructive/20",
  },
}

export default function AccountsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Bagli Hesaplar
        </h1>
        <p className="text-sm text-muted-foreground">
          Reklam platformu baglantilarinizi yonetin.
        </p>
      </div>

      {/* Connect buttons */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { name: "Google Ads", icon: GoogleIcon, connected: true },
          { name: "Meta Ads", icon: MetaIcon, connected: true },
          { name: "TikTok Ads", icon: TikTokIcon, connected: true },
        ].map((platform) => (
          <Card
            key={platform.name}
            className="border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <platform.icon className="size-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{platform.name}</p>
                <p className="text-xs text-muted-foreground">
                  {platform.connected ? "Hesap bagli" : "Bagli degil"}
                </p>
              </div>
              <Button
                variant={platform.connected ? "outline" : "default"}
                size="sm"
                className={
                  platform.connected
                    ? "border-border text-muted-foreground hover:text-foreground"
                    : "bg-primary text-primary-foreground"
                }
              >
                {platform.connected ? "Yonet" : "Bagla"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connected account cards */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Hesap Detaylari</h2>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {connectedAccounts.map((account) => {
            const PlatformIcon = platformIcons[account.platform]
            const statusInfo = statusConfig[account.status]
            const StatusIcon = statusInfo.icon
            return (
              <Card
                key={account.id}
                className="border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                        <PlatformIcon className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {account.accountName}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {account.accountId}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={statusInfo.color}>
                      <StatusIcon className="mr-1 size-3" />
                      {account.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 rounded-lg bg-secondary/50 p-3">
                    <div className="flex flex-col items-center gap-1">
                      <DollarSign className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {account.spend}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Harcama</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Megaphone className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {account.campaigns}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Kampanya
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {account.lastSync}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Son Senk.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 border-border text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className="size-3" />
                      Senkronize Et
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 border-border text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="size-3" />
                      Ac
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
