"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PlusCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CampaignTable } from "@/components/campaign-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useFilter } from "@/lib/filters"
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
import { toast } from "sonner"

interface Campaign {
  id: string
  name: string
  image_url?: string
  platform: string
  status: "Aktif" | "Duraklatildi" | "Tamamlandi"
  budget: number
  spend: number
  clicks: number
  add_to_cart: number
  conversions: number
  ctr: number
  cpc: number
  roas: number
}

export default function CampaignsPage() {
  const { selectedAccount, selectedPlatform, dateRange } = useFilter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [viewCampaign, setViewCampaign] = useState<Campaign | null>(null)
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null)
  const [deleteCampaign, setDeleteCampaign] = useState<Campaign | null>(null)
  const [editName, setEditName] = useState("")
  const [editBudget, setEditBudget] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (selectedAccount) query.set('accountId', selectedAccount)
      if (selectedPlatform) query.set('platform', selectedPlatform)
      if (dateRange) query.set('dateRange', dateRange)

      const response = await fetch(`/api/campaigns?${query.toString()}`)
      if (!response.ok) throw new Error('Kampanyalar yuklenemedi')
      const data = await response.json()
      setCampaigns(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [selectedAccount, selectedPlatform, dateRange])

  const handleView = (campaign: Campaign) => {
    setViewCampaign(campaign)
  }

  const handleEdit = (campaign: Campaign) => {
    setEditCampaign(campaign)
    setEditName(campaign.name)
    setEditBudget(campaign.budget.toString())
  }

  const handleToggleStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === "Aktif" ? "Duraklatildi" : "Aktif"
    try {
      const response = await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: campaign.id, status: newStatus })
      })
      if (!response.ok) throw new Error('Durum guncellenemedi')
      toast.success(`Kampanya ${newStatus === 'Aktif' ? 'devam ettirildi' : 'duraklatildi'}`)
      fetchCampaigns()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async () => {
    if (!deleteCampaign) return
    setSaving(true)
    try {
      const response = await fetch('/api/campaigns', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteCampaign.id })
      })
      if (!response.ok) throw new Error('Kampanya silinemedi')
      toast.success('Kampanya silindi')
      setDeleteCampaign(null)
      fetchCampaigns()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editCampaign) return
    setSaving(true)
    try {
      const response = await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editCampaign.id,
          name: editName,
          budget: parseFloat(editBudget)
        })
      })
      if (!response.ok) throw new Error('Kampanya guncellenemedi')
      toast.success('Kampanya guncellendi')
      setEditCampaign(null)
      fetchCampaigns()
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
        <span className="ml-2 text-sm text-muted-foreground">Kampanyalar yukleniyor...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kampanyalar
          </h1>
          <p className="text-sm text-muted-foreground">
            Tum reklam kampanyalarinizi yonetin.
          </p>
        </div>
        <Button asChild className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
          <Link href="/dashboard/campaigns/create">
            <PlusCircle className="size-4" />
            Kampanya Olustur
          </Link>
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <CampaignTable
          campaigns={campaigns}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={setDeleteCampaign}
        />
      )}

      {/* View Dialog */}
      <Dialog open={!!viewCampaign} onOpenChange={() => setViewCampaign(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Kampanya Detaylari</DialogTitle>
            <DialogDescription>
              {viewCampaign?.name} kampanyasinin detaylari
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Platform</Label>
                <p className="font-medium">{viewCampaign?.platform}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Durum</Label>
                <p className="font-medium">{viewCampaign?.status}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Butce</Label>
                <p className="font-medium">{Number(viewCampaign?.budget || 0).toLocaleString()} TL</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Harcama</Label>
                <p className="font-medium">{Number(viewCampaign?.spend || 0).toLocaleString()} TL</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tiklama</Label>
                <p className="font-medium">{viewCampaign?.clicks?.toLocaleString() || 0}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Sepet</Label>
                <p className="font-medium">{viewCampaign?.add_to_cart || 0}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Donusum</Label>
                <p className="font-medium">{viewCampaign?.conversions || 0}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">ROAS</Label>
                <p className="font-medium">{Number(viewCampaign?.roas || 0).toFixed(2)}x</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCampaign} onOpenChange={() => setEditCampaign(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kampanya Duzenle</DialogTitle>
            <DialogDescription>
              Kampanya bilgilerini guncelleyin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Kampanya Adi</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Butce (TL)</Label>
              <Input
                id="budget"
                type="number"
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCampaign(null)}>Iptal</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteCampaign} onOpenChange={() => setDeleteCampaign(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kampanyayi Sil</DialogTitle>
            <DialogDescription>
              Bu islem geri alinamaz. "{deleteCampaign?.name}" kampanyasini silmek istediginizden emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCampaign(null)}>Iptal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}