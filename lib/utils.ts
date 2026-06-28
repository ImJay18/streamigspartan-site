export function getWhatsAppLink(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, '')
  const encoded = message ? encodeURIComponent(message) : ''
  return `https://wa.me/57${clean}${encoded ? `?text=${encoded}` : ''}`
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function calculateDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
