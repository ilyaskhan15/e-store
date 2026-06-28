import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { authApi } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const setUser = useAuthStore((state) => state.setUser)
  const pushToast = useToastStore((state) => state.pushToast)

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const data = await authApi.login(form)
      login(data)
      setUser(data.user)
      pushToast({ type: 'success', title: 'Welcome back', message: 'You are now signed in.' })
      navigate(location.state?.from?.pathname || '/')
    } catch (error) {
      pushToast({ type: 'error', title: 'Login failed', message: error?.response?.data?.detail || 'Check your credentials and try again.' })
    }
  }

  return (
    <div className="min-h-screen bg-navy px-4 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-text shadow-luxe">
          <p className="font-heading text-5xl text-navy">Sign In</p>
          <p className="mt-2 text-sm text-muted">Access orders, wishlist, and checkout faster.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" placeholder="Email" className="w-full rounded-2xl border border-navy/10 bg-surface px-4 py-3 outline-none" />
            <input value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" placeholder="Password" className="w-full rounded-2xl border border-navy/10 bg-surface px-4 py-3 outline-none" />
            <button type="submit" className="w-full rounded-full bg-gold px-5 py-3 font-bold text-navy transition hover:bg-[#d8b53c]">Login</button>
          </form>
          <div className="mt-6 grid gap-3">
            <button type="button" className="rounded-full border border-navy/15 px-5 py-3 font-semibold text-navy">Continue with Google</button>
            <button type="button" className="rounded-full border border-navy/15 px-5 py-3 font-semibold text-navy">Continue with Facebook</button>
          </div>
          <p className="mt-6 text-sm text-muted">No account yet? <Link to="/register" className="font-semibold text-navy">Create one</Link></p>
        </div>
      </div>
    </div>
  )
}
