"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type CurrencyCode = "TRY"

interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  label: string
}

export const currencies: CurrencyInfo[] = [
  { code: "TRY", symbol: "\u20BA", label: "Turk Lirasi (TRY)" },
]

interface CurrencyContextType {
  currency: CurrencyInfo
  format: (amount: number, opts?: { compact?: boolean; decimals?: number }) => string
  convert: (amount: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const currency = currencies[0]

  const convert = useCallback(
    (amount: number) => amount,
    []
  )

  const format = useCallback(
    (amount: number, opts?: { compact?: boolean; decimals?: number }) => {
      const decimals = opts?.decimals ?? 2

      if (opts?.compact && amount >= 1000) {
        const formatted = new Intl.NumberFormat("tr-TR", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(amount)
        return `${formatted} ${currency.symbol}`
      }

      const formatted = new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(amount)
      return `${formatted} ${currency.symbol}`
    },
    [currency.symbol]
  )

  return (
    <CurrencyContext.Provider value={{ currency, format, convert }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider")
  return ctx
}
