import { USD_TO_INR } from './constants'

export function fmtINR(usd: number): string {
  return `₹${(usd * USD_TO_INR).toFixed(2)}`
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone
  return '•'.repeat(phone.length - 4) + phone.slice(-4)
}
