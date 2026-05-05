import { USD_TO_INR } from './constants'

export function fmtINR(usd: number): string {
  return `₹${(usd * USD_TO_INR).toFixed(2)}`
}
