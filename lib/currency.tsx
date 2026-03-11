"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type CurrencyCode = "USD" | "EUR" | "TRY" | "GBP"

interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  label: string
  rate: number
}

export const currencies: CurrencyInfo[] = [
  { code: "USD", symbol: "$", label: "ABD Dolari (USD)", rate: 1 },
  { code: "EUR", symbol: "\u20AC", label: "Euro (EUR)", rate: 0.92 },
  { code: "TRY", symbol: "\u20BA", label: "Turk Lirasi (TRY)", rate: 38.5 },
  { code: "GBP", symbol: "\u00A3", label: "Ingiliz Sterlini (GBP)", rate: 0.79 },
]

interface CurrencyContextType {
  currency: CurrencyInfo
  setCurrencyCode: (code: CurrencyCode) => void
  format: (amountInUsd: number, opts?: { compact?: boolean; decimals?: number }) => string
  convert: (amountInUsd: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD")
  const currency = currencies.find((c) => c.code === currencyCode) ?? currencies[0]

  const convert = useCallback(
    (amountInUsd: number) => amountInUsd * currency.rate,
    [currency.rate]
  )

  const format = useCallback(
    (amountInUsd: number, opts?: { compact?: boolean; decimals?: number }) => {
      const converted = amountInUsd * currency.rate
      const decimals = opts?.decimals ?? 2

      if (opts?.compact && converted >= 1000) {
        const formatted = new Intl.NumberFormat("tr-TR", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(converted)
        return `${currency.symbol}${formatted}`
      }

      const formatted = new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(converted)
      return `${currency.symbol}${formatted}`
    },
    [currency.rate, currency.symbol]
  )

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, format, convert }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider")
  return ctx
}
