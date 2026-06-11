/** Compact Indian price: 12500000 → "₹1.25 Cr", 4500000 → "₹45 L". */
export function formatINR(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return 'Price on request'
  if (amount >= 10000000) {
    const cr = amount / 10000000
    return `₹${Number(cr.toFixed(2))} Cr`
  }
  if (amount >= 100000) {
    const l = amount / 100000
    return `₹${Number(l.toFixed(2))} L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

export const PHONE_RAW = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+919876543210'
export const PHONE_DIGITS = PHONE_RAW.replace(/\D/g, '') || '919876543210'
