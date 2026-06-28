import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import { authApi } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { useOrders } from '@/hooks/useOrders'
import { useToastStore } from '@/store/toastStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'

const tabs = ['My Orders', 'Wishlist', 'Address Book', 'Password']

const statusClasses = {
  pending: 'bg-red/10 text-red',
  confirmed: 'bg-gold/10 text-navy',
  processing: 'bg-info/10 text-info',
  shipped: 'bg-navy/10 text-navy',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-red/10 text-red',
}

export default function AccountPage() {
  const [tab, setTab] = useState('My Orders')
  const { data, isLoading } = useOrders()
  const orders = data?.results || []
  const wishlistItems = useWishlistStore((state) => state.items)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const pushToast = useToastStore((state) => state.pushToast)
  const [profileForm, setProfileForm] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    postal_code: user?.postal_code || '',
  })
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' })

  const handleProfileSave = async (event) => {
    event.preventDefault()
    try {
      const updated = await authApi.updateMe(profileForm)
      setUser(updated)
      pushToast({ type: 'success', title: 'Profile updated', message: 'Your address book details were saved.' })
    } catch {
      pushToast({ type: 'error', title: 'Update failed', message: 'Please check the profile form and try again.' })
    }
  }

  const handlePasswordSave = async (event) => {
    event.preventDefault()
    pushToast({ type: 'info', title: 'Password update placeholder', message: 'Connect this form to a password-change endpoint when available.' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Account</p>
        <h1 className="text-7xl text-navy">My Dashboard</h1>
      </div>

      <div className="flex flex-wrap gap-2 rounded-3xl bg-white p-3 shadow-sm">
        {tabs.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === item ? 'bg-navy text-white' : 'bg-surface text-navy hover:bg-navy/5'}`}>
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'My Orders' ? (
          isLoading ? <LoadingSpinner /> : orders.length ? (
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-luxe">
              <div className="hidden grid-cols-[1fr_120px_140px_120px_100px] gap-4 border-b border-navy/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.25em] text-muted md:grid">
                <span>Order ID</span><span>Date</span><span>Status</span><span>Total</span><span />
              </div>
              <div className="divide-y divide-navy/10">
                {orders.map((order) => (
                  <div key={order.id} className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_120px_140px_120px_100px] md:items-center">
                    <div>
                      <p className="font-semibold text-navy">{order.order_number}</p>
                      <p className="text-sm text-muted">{order.shipping_name}</p>
                    </div>
                    <p className="text-sm text-muted">{formatDate(order.created_at)}</p>
                    <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] ${statusClasses[order.status] || 'bg-surface text-navy'}`}>{order.status}</span>
                    <p className="font-semibold text-navy">{formatPrice(order.total)}</p>
                    <button type="button" className="rounded-full border border-navy px-4 py-2 text-sm font-bold text-navy">View</button>
                  </div>
                ))}
              </div>
            </div>
          ) : <EmptyState title="No orders yet" description="Your completed orders will appear here." action={<Link to="/shop" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Shop Kits</Link>} />
        ) : null}

        {tab === 'Wishlist' ? (
          wishlistItems.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {wishlistItems.map((product) => (
                <div key={product.id} className="overflow-hidden rounded-3xl bg-white shadow-luxe">
                  <img src={product.primary_image || '/src/assets/logo-mark.svg'} alt={product.name} loading="lazy" className="h-72 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted">Wishlist</p>
                    <h2 className="font-heading text-4xl text-navy">{product.name}</h2>
                    <Link to={`/product/${product.id}`} className="mt-4 inline-flex rounded-full bg-gold px-4 py-2 font-bold text-navy">View Product</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState title="Wishlist is empty" description="Save products here for later." action={<Link to="/shop" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Explore Shop</Link>} />
        ) : null}

        {tab === 'Address Book' ? (
          <form onSubmit={handleProfileSave} className="max-w-3xl space-y-4 rounded-[2rem] bg-white p-6 shadow-luxe">
            <h2 className="font-heading text-5xl text-navy">Address Book</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(profileForm).map(([field, value]) => (
                <input key={field} value={value} onChange={(event) => setProfileForm((current) => ({ ...current, [field]: event.target.value }))} placeholder={field.replaceAll('_', ' ')} className="rounded-2xl border border-navy/10 bg-surface px-4 py-3 outline-none" />
              ))}
            </div>
            <button type="submit" className="rounded-full bg-navy px-5 py-3 font-bold text-white">Save Address</button>
          </form>
        ) : null}

        {tab === 'Password' ? (
          <form onSubmit={handlePasswordSave} className="max-w-2xl space-y-4 rounded-[2rem] bg-white p-6 shadow-luxe">
            <h2 className="font-heading text-5xl text-navy">Update Password</h2>
            <input value={passwordForm.current_password} onChange={(event) => setPasswordForm((current) => ({ ...current, current_password: event.target.value }))} type="password" placeholder="Current password" className="w-full rounded-2xl border border-navy/10 bg-surface px-4 py-3 outline-none" />
            <input value={passwordForm.new_password} onChange={(event) => setPasswordForm((current) => ({ ...current, new_password: event.target.value }))} type="password" placeholder="New password" className="w-full rounded-2xl border border-navy/10 bg-surface px-4 py-3 outline-none" />
            <input value={passwordForm.confirm_password} onChange={(event) => setPasswordForm((current) => ({ ...current, confirm_password: event.target.value }))} type="password" placeholder="Confirm password" className="w-full rounded-2xl border border-navy/10 bg-surface px-4 py-3 outline-none" />
            <button type="submit" className="rounded-full bg-gold px-5 py-3 font-bold text-navy">Save Password</button>
          </form>
        ) : null}
      </div>
    </div>
  )
}
