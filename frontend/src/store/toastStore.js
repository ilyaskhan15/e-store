import { create } from 'zustand'

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const useToastStore = create((set) => ({
  toasts: [],
  pushToast: ({ title, message, type = 'info' }) => {
    const id = createId()
    set((state) => ({ toasts: [...state.toasts, { id, title, message, type }] }))
    setTimeout(() => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })), 3500)
    return id
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}))
