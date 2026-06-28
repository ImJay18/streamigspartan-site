import type { CartItem, AppliedCombo, CartState } from '@/types/cart'
import type { Combo } from '@/types'

const STORAGE_KEY = 'spartan-cart'

// ─── Persistencia ────────────────────────────────────────────
export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

// ─── Detección de combos ─────────────────────────────────────
// Lógica:
// 1. Ordena combos de mayor a menor (más plataformas primero)
// 2. Para cada combo, verifica si el carrito tiene ≥1 pantalla de CADA plataforma del combo
// 3. Si encaja, aplica el combo (consume 1 pantalla de cada plataforma incluida)
// 4. Repite hasta que no haya más combos aplicables
// 5. Las pantallas restantes quedan como items unitarios

export function computeCart(items: CartItem[], combos: Combo[]): CartState {
  if (items.length === 0) return { items: [], appliedCombos: [], total: 0 }

  // Copia mutable de pantallas disponibles por plataforma
  const available: Record<string, number> = {}
  items.forEach(i => { available[i.platformName] = i.screens })

  // Ordenar combos: más plataformas primero, luego precio más alto
  const sorted = [...combos]
    .filter(c => c.active)
    .sort((a, b) => b.platform_names.length - a.platform_names.length || b.price - a.price)

  const appliedCombos: AppliedCombo[] = []

  // Aplicar combos greedily
  let changed = true
  while (changed) {
    changed = false
    for (const combo of sorted) {
      // Verificar si todas las plataformas del combo tienen ≥1 pantalla disponible
      const canApply = combo.platform_names.every(name => (available[name] ?? 0) >= 1)
      if (!canApply) continue

      // Consumir 1 pantalla de cada plataforma del combo
      combo.platform_names.forEach(name => { available[name] -= 1 })

      // Calcular cuánto se ahorra vs precio unitario
      const unitSum = combo.platform_names.reduce((acc, name) => {
        const item = items.find(i => i.platformName === name)
        return acc + (item?.unitPrice ?? 0)
      }, 0)

      appliedCombos.push({
        comboId:        combo.id,
        comboName:      combo.name,
        platformNames:  combo.platform_names,
        platformLogos:  combo.platform_logos ?? [],
        comboPrice:     combo.price,
        savedAmount:    Math.max(0, unitSum - combo.price),
      })
      changed = true
      break // reiniciar para verificar si hay otro combo aplicable
    }
  }

  // Pantallas sobrantes como items unitarios
  const remainingItems: CartItem[] = items
    .map(item => ({
      ...item,
      screens: available[item.platformName] ?? 0,
    }))
    .filter(item => item.screens > 0)

  // Total
  const comboTotal    = appliedCombos.reduce((acc, c) => acc + c.comboPrice, 0)
  const unitTotal     = remainingItems.reduce((acc, i) => acc + i.unitPrice * i.screens, 0)
  const total         = comboTotal + unitTotal

  return { items: remainingItems, appliedCombos, total }
}

// ─── Generar mensaje WhatsApp ─────────────────────────────────
export function buildWhatsAppMessage(state: CartState, originalItems: CartItem[]): string {
  const COP = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)
  const lines: string[] = ['🎬 *Pedido Streaming Spartan*', '']

  if (state.appliedCombos.length > 0) {
    lines.push('*Combos:*')
    state.appliedCombos.forEach(c => {
      lines.push(`• ${c.comboName} (${c.platformNames.join(' + ')}) — ${COP(c.comboPrice)}`)
    })
    lines.push('')
  }

  if (state.items.length > 0) {
    lines.push('*Plataformas adicionales:*')
    state.items.forEach(i => {
      lines.push(`• ${i.platformName} × ${i.screens} pantalla${i.screens > 1 ? 's' : ''} — ${COP(i.unitPrice * i.screens)}`)
    })
    lines.push('')
  }

  lines.push(`*Total: ${COP(state.total)}*`)
  lines.push('')
  lines.push('Quiero confirmar mi pedido 🙌')

  return lines.join('\n')
}
