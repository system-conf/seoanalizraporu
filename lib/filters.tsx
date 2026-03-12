"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface FilterContextType {
  selectedAccount: string
  setSelectedAccount: (id: string) => void
  selectedPlatform: string
  setSelectedPlatform: (platform: string) => void
  dateRange: string
  setDateRange: (range: string) => void
}

const FilterContext = createContext<FilterContextType | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedAccount, setSelectedAccount] = useState<string>("all")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("Tumu")
  const [dateRange, setDateRange] = useState<string>("30d")

  return (
    <FilterContext.Provider value={{
      selectedAccount, 
      setSelectedAccount,
      selectedPlatform,
      setSelectedPlatform,
      dateRange,
      setDateRange
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error("useFilter must be used within FilterProvider")
  return ctx
}
