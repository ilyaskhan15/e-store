import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, ChevronLeft, ChevronRight, ShieldCheck, ShoppingCart } from 'lucide-react'

import EmptyState from '@/components/EmptyState'
import QuantityStepper from '@/components/QuantityStepper'
import SkeletonCard from '@/components/SkeletonCard'
import { productsApi } from '@/api'
import { useAuth } from '@/hooks/useAuth'
import { useProduct } from '@/hooks/useProduct'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/formatPrice'
import { sizeOptions } from '@/utils/constants'

const tabNames = ['Description', 'Size Guide', 'Shipping Info', 'Reviews']

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(id)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedTab, setSelectedTab] = useState('Description')
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const addItem = useCartStore((state) => state.addItem)
  const pushToast = useToastStore((state) => state.pushToast)
  const { isAuthenticated } = useAuth()

  const images = useMemo(() => product?.images || [], [product])
  const activeSrc = images[activeImage]?.image || images[0]?.image || '/src/assets/logo-mark.svg'
  const price = Number(product?.sale_price || product?.price || 0)
  const originalPrice = product?.sale_price ? Number(product?.price || 0) : null

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <SkeletonCard />
          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-luxe">
            <div className="h-8 w-2/3 animate-pulse rounded bg-surface" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-surface" />
            <div className="h-4 w-full animate-pulse rounded bg-surface" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-surface" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return <EmptyState title="Product not found" description="The item you requested is unavailable." action={<button onClick={() => navigate('/shop')} className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Back to Shop</button>} />
  }

  const handleAdd = () => {
    addItem(product, selectedSize, quantity)
    pushToast({ type: 'success', title: 'Added to cart', message: `${product.name} in size ${selectedSize} was added.` })
  }

  const handleReviewSubmit = async (event) => {
    event.preventDefault()
    try {
      await productsApi.createReview(product.id, reviewForm)
      pushToast({ type: 'success', title: 'Review submitted', message: 'Thanks for sharing your feedback.' })
      setReviewForm({ rating: 5, comment: '' })
    } catch (error) {
      pushToast({ type: 'error', title: 'Review failed', message: error?.response?.data?.detail || 'Login required to submit reviews.' })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm"><ChevronLeft className="h-4 w-4" /> Back</button>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-luxe">
            <button type="button" onClick={() => setActiveImage((current) => Math.max(current - 1, 0))} className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy shadow-lg"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onClick={() => setActiveImage((current) => Math.min(current + 1, images.length - 1))} className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy shadow-lg"><ChevronRight className="h-5 w-5" /></button>
            <img src={activeSrc} alt={product.name} loading="lazy" className="h-[560px] w-full cursor-zoom-in object-cover" onClick={() => window.open(activeSrc, '_blank')} />
          </div>
          <div className="grid grid-cols-5 gap-3">
            {images.slice(0, 5).map((image, index) => (
              <button key={image.id} type="button" onClick={() => setActiveImage(index)} className={cn('overflow-hidden rounded-2xl border-2 bg-white', activeImage === index ? 'border-navy' : 'border-transparent')}>
                <img src={image.image} alt={image.alt_text || product.name} loading="lazy" className="h-28 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-luxe">
          <p className="inline-flex rounded-full bg-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-navy">Team badge placeholder</p>
          <h1 className="mt-4 text-7xl text-navy">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-full bg-red px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-white">{product.discount_percent}% Off</span>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-navy">{product.category?.name}</span>
          </div>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-4xl font-bold text-navy">{formatPrice(price)}</span>
            {originalPrice ? <span className="pb-1 text-lg text-muted line-through">{formatPrice(originalPrice)}</span> : null}
          </div>
          <p className="mt-4 leading-7 text-muted">{product.description}</p>

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-muted">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button key={size} type="button" onClick={() => setSelectedSize(size)} className={cn('rounded-full px-4 py-2 text-sm font-bold transition', selectedSize === size ? 'bg-navy text-white' : 'bg-surface text-navy hover:bg-navy/5')}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-muted">Quantity</p>
              <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(product.stock || 99, 99)} />
            </div>
            <div className="rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-navy">Stock: {product.stock}</div>
          </div>

          <div className="mt-6 space-y-3">
            <button type="button" onClick={handleAdd} className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-bold text-navy transition hover:bg-[#d8b53c]"><ShoppingCart className="h-4 w-4" /> Add to Cart</button>
            <button type="button" onClick={() => navigate('/checkout')} className="flex w-full items-center justify-center rounded-full border-2 border-navy px-6 py-4 font-bold text-navy transition hover:bg-navy hover:text-white">Buy Now</button>
          </div>

          <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-surface p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3"><BadgeCheck className="h-5 w-5 text-gold" /> Authentic designs</div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-gold" /> Secure checkout</div>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-luxe">
        <div className="flex flex-wrap gap-2 border-b border-navy/10 pb-4">
          {tabNames.map((tab) => (
            <button key={tab} type="button" onClick={() => setSelectedTab(tab)} className={cn('rounded-full px-4 py-2 text-sm font-bold transition', selectedTab === tab ? 'bg-navy text-white' : 'bg-surface text-navy hover:bg-navy/5')}>
              {tab}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {selectedTab === 'Description' ? <p className="max-w-3xl leading-8 text-muted">{product.description}</p> : null}
          {selectedTab === 'Size Guide' ? <div className="max-w-2xl rounded-3xl bg-surface p-5 text-sm leading-7 text-muted">Use your usual football shirt size. The selected fit is tailored for match-day wear and relaxed street styling.</div> : null}
          {selectedTab === 'Shipping Info' ? <div className="max-w-2xl rounded-3xl bg-surface p-5 text-sm leading-7 text-muted">Tracked shipping with free delivery over $50. Processing typically begins within 1 to 2 business days.</div> : null}
          {selectedTab === 'Reviews' ? (
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <form onSubmit={handleReviewSubmit} className="space-y-4 rounded-3xl bg-surface p-5">
                <h3 className="font-heading text-5xl text-navy">Leave a Review</h3>
                <select value={reviewForm.rating} onChange={(event) => setReviewForm((current) => ({ ...current, rating: Number(event.target.value) }))} className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3">
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} Stars</option>)}
                </select>
                <textarea value={reviewForm.comment} onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))} rows={5} placeholder={isAuthenticated() ? 'Share your thoughts...' : 'Login required to review'} className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 outline-none" />
                <button type="submit" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Submit Review</button>
              </form>
              <div className="space-y-4">
                {(product.reviews || []).length ? product.reviews.map((review) => (
                  <div key={review.id} className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-navy">{review.user?.email}</p>
                      <p className="text-sm text-muted">{review.rating}/5</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted">{review.comment}</p>
                  </div>
                )) : <EmptyState title="No reviews yet" description="Be the first to review this product." />}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
