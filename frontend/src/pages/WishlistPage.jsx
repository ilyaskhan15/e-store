import { Link } from 'react-router-dom'

import EmptyState from '@/components/EmptyState'
import { useWishlistStore } from '@/store/wishlistStore'

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items)

  if (!items.length) {
    return <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8"><EmptyState title="Wishlist is empty" description="Save products you want to revisit later." action={<Link to="/shop" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Browse Kits</Link>} /></div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Wishlist</p>
        <h1 className="text-7xl text-navy">Saved Items</h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-3xl bg-white shadow-luxe">
            <img src={product.primary_image || '/src/assets/logo-mark.svg'} alt={product.name} loading="lazy" className="h-72 w-full object-cover" />
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-muted">Saved for later</p>
              <h2 className="font-heading text-4xl text-navy">{product.name}</h2>
              <Link to={`/product/${product.id}`} className="mt-4 inline-flex rounded-full bg-gold px-4 py-2 font-bold text-navy">Open Product</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
