import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: ({ user, access, refresh }) => set({ user, token: access, refreshToken: refresh }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
      setUser: (user) => set({ user }),
      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'fifa-auth-store',
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken }),
    }
  )
)
