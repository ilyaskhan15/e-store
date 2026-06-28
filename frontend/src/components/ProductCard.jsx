import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/formatPrice'

export default function ProductCard({ product, className }) {
  const addItem = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id))
  const pushToast = useToastStore((state) => state.pushToast)
  const price = Number(product.sale_price || product.price || 0)
  const originalPrice = product.sale_price ? Number(product.price || 0) : null

  const handleAddToCart = () => {
    addItem(product, 'M', 1)
    pushToast({ type: 'success', title: 'Added to cart', message: `${product.name} was added to your cart.` })
  }

  return (
    <article className={cn('group overflow-hidden rounded-3xl bg-white shadow-luxe transition hover:-translate-y-1', className)}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <img src={product.primary_image || '/src/assets/logo-mark.svg'} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          {product.is_on_sale ? <span className="absolute left-4 top-4 rounded-full bg-red px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">{product.discount_percent}% Off</span> : null}
          <button type="button" onClick={(event) => { event.preventDefault(); toggleWishlist(product); pushToast({ type: 'info', title: isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', message: product.name }); }} className="absolute right-4 top-4 rounded-full bg-white/95 p-2 text-navy shadow-lg transition hover:bg-gold hover:text-navy">
            <Heart className={cn('h-4 w-4', isWishlisted ? 'fill-red text-red' : '')} />
          </button>
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">{product.category?.name || product.national_team || product.club_name}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading text-4xl leading-none text-navy">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Star className="h-4 w-4 fill-gold text-gold" />
          <span>4.8</span>
          <span>·</span>
          <span>Trusted pick</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-navy">{formatPrice(price)}</span>
          {originalPrice ? <span className="text-sm text-muted line-through">{formatPrice(originalPrice)}</span> : null}
        </div>
        <button type="button" onClick={handleAddToCart} className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-bold text-navy transition hover:bg-[#d8b53c]">
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </article>
  )
}
