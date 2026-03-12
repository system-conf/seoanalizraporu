import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { FilterProvider } from "@/lib/filters"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FilterProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-1 flex-col pl-64">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </FilterProvider>
  )
}
