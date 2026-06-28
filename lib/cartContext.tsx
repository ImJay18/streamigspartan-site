'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { CartItem, CartState } from '@/types/cart'
import type { Combo } from '@/types'
import { saveCart, loadCart, computeCart } from './cart'

interface CartContextType {
  items:       CartItem[]
  state:       CartState
  isOpen:      boolean
  openCart:    () => void
  closeCart:   () => void
  addItem:     (item: Omit<CartItem, 'screens'>, screens: number) => void
  updateItem:  (platformId: string, screens: number) => void
  removeItem:  (platformId: string) => void
  clearCart:   () => void
  setCombo:    (combos: Combo[]) => void
}

const CartCtx = createContext<CartContextType | null>(null)

export function CartProvider({ children, initialCombos }: { children: React.ReactNode; initialCombos: Combo[] }) {
  const [items,  setItems]  = useState<CartItem[]>([])
  const [combos, setCombos] = useState<Combo[]>(initialCombos)
  const [isOpen, setIsOpen] = useState(false)
  const [state,  setState]  = useState<CartState>({ items: [], appliedCombos: [], total: 0 })

  // Cargar desde localStorage
  useEffect(() => {
    const saved = loadCart()
    if (saved.length > 0) setItems(saved)
  }, [])

  // Recalcular estado cuando cambian items o combos
  useEffect(() => {
    setState(computeCart(items, combos))
    saveCart(items)
  }, [items, combos])

  const addItem = useCallback((item: Omit<CartItem, 'screens'>, screens: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.platformId === item.platformId)
      if (existing) {
        return prev.map(i => i.platformId === item.platformId
          ? { ...i, screens: i.screens + screens }
          : i)
      }
      return [...prev, { ...item, screens }]
    })
    setIsOpen(true)
  }, [])

  const updateItem = useCallback((platformId: string, screens: number) => {
    if (screens <= 0) {
      setItems(prev => prev.filter(i => i.platformId !== platformId))
    } else {
      setItems(prev => prev.map(i => i.platformId === platformId ? { ...i, screens } : i))
    }
  }, [])

  const removeItem = useCallback((platformId: string) => {
    setItems(prev => prev.filter(i => i.platformId !== platformId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setIsOpen(false)
  }, [])

  return (
    <CartCtx.Provider value={{
      items, state, isOpen,
      openCart:  () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem, updateItem, removeItem, clearCart,
      setCombo: setCombos,
    }}>
      {children}
    </CartCtx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
