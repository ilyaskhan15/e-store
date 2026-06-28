import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Search, ShoppingCart, Heart, X } from 'lucide-react'

import { useCartStore } from '@/store/cartStore'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Account', to: '/account' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const cartCount = useCartStore((state) => state.cartCount())

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src="/src/assets/logo-mark.svg" alt="FIFA Kit Store" className="h-10 w-10" />
          <div>
            <p className="font-heading text-4xl leading-none text-gold">FIFA KIT</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Dropshipping Store</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `text-sm font-medium uppercase tracking-[0.2em] transition hover:text-gold ${isActive ? 'text-gold' : 'text-white/80'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/shop" className="hidden rounded-full border border-white/15 p-2 transition hover:bg-white/10 lg:inline-flex">
            <Search className="h-5 w-5" />
          </Link>
          <Link to="/wishlist" className="hidden rounded-full border border-white/15 p-2 transition hover:bg-white/10 lg:inline-flex">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="relative rounded-full border border-white/15 p-2 transition hover:bg-white/10">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1 text-[10px] font-bold text-white">{cartCount}</span> : null}
          </Link>
          <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-white/15 p-2 transition hover:bg-white/10 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside className={`absolute right-0 top-0 h-full w-full max-w-sm bg-navy p-6 text-white transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="mb-8 flex items-center justify-between">
            <span className="font-heading text-5xl text-gold">Menu</span>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/15 p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block rounded-2xl border border-white/10 px-4 py-4 text-lg uppercase tracking-[0.2em] text-white/90 transition hover:border-gold hover:text-gold">
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </header>
  )
}
