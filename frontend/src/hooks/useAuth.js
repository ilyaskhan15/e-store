import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    login: state.login,
    logout: state.logout,
    isAuthenticated: state.isAuthenticated,
    setUser: state.setUser,
  }))
}
