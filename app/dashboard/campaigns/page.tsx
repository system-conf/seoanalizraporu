import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CampaignTable } from "@/components/campaign-table"

export default function CampaignsPage() {
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
      <CampaignTable />
    </div>
  )
}
