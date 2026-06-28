import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const getLinePrice = (item) => Number(item.product.sale_price || item.product.price || 0)

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, quantity = 1) =>
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.product.id === product.id && item.size === size)
          if (existingIndex >= 0) {
            const items = [...state.items]
            items[existingIndex] = { ...items[existingIndex], quantity: items[existingIndex].quantity + quantity }
            return { items }
          }
          return { items: [...state.items, { product, size, quantity }] }
        }),
      removeItem: (productId, size) => set((state) => ({ items: state.items.filter((item) => !(item.product.id === productId && item.size === size)) })),
      updateQuantity: (productId, size, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => !(item.product.id === productId && item.size === size))
              : state.items.map((item) => (item.product.id === productId && item.size === size ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ items: [] }),
      cartTotal: () => get().items.reduce((total, item) => total + getLinePrice(item) * item.quantity, 0),
      cartCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: 'fifa-cart-store' }
  )
)
