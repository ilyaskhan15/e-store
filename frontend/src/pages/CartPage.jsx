import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'

import EmptyState from '@/components/EmptyState'
import QuantityStepper from '@/components/QuantityStepper'
import { ordersApi } from '@/api'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import { formatPrice } from '@/utils/formatPrice'
import { useState } from 'react'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const pushToast = useToastStore((state) => state.pushToast)
  const subtotal = useCartStore((state) => state.cartTotal())
  const [discountCode, setDiscountCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const shipping = subtotal >= 50 ? 0 : 5.99

  const applyDiscount = async () => {
    try {
      const response = await ordersApi.validateDiscount({ code: discountCode, subtotal })
      setDiscountAmount(Number(response.discount_amount || 0))
      pushToast({ type: 'success', title: 'Discount applied', message: 'Your discount code is valid.' })
    } catch (error) {
      setDiscountAmount(0)
      pushToast({ type: 'error', title: 'Discount rejected', message: error?.response?.data?.message || 'That code could not be applied.' })
    }
  }

  if (!items.length) {
    return <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8"><EmptyState title="Your cart is empty" description="Add kits and fanwear to start building your order." action={<Link to="/shop" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Shop Now</Link>} /></div>
  }

  const total = Math.max(subtotal + shipping - discountAmount, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Cart</p>
        <h1 className="text-7xl text-navy">Review Your Order</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-luxe">
          <div className="hidden grid-cols-[110px_minmax(0,1fr)_120px_120px_120px_60px] gap-4 border-b border-navy/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.25em] text-muted md:grid">
            <span>Image</span><span>Product</span><span>Size</span><span>Qty</span><span>Total</span><span />
          </div>
          <div className="divide-y divide-navy/10">
            {items.map((item) => {
              const unitPrice = Number(item.product.sale_price || item.product.price || 0)
              return (
                <div key={`${item.product.id}-${item.size}`} className="grid gap-4 px-6 py-5 md:grid-cols-[110px_minmax(0,1fr)_120px_120px_120px_60px] md:items-center">
                  <img src={item.product.primary_image || '/src/assets/logo-mark.svg'} alt={item.product.name} loading="lazy" className="h-24 w-full rounded-2xl object-cover" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-muted">{item.product.category?.name}</p>
                    <h2 className="font-heading text-4xl text-navy">{item.product.name}</h2>
                    <p className="text-sm text-muted">{item.product.national_team || item.product.club_name}</p>
                  </div>
                  <div className="text-sm font-semibold text-navy">{item.size}</div>
                  <QuantityStepper value={item.quantity} onChange={(quantity) => updateQuantity(item.product.id, item.size, quantity)} />
                  <div className="font-semibold text-navy">{formatPrice(unitPrice * item.quantity)}</div>
                  <button type="button" onClick={() => { removeItem(item.product.id, item.size); pushToast({ type: 'info', title: 'Removed item', message: item.product.name }); }} className="inline-flex items-center justify-center rounded-full p-2 text-red transition hover:bg-red/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-luxe">
          <h2 className="font-heading text-5xl text-navy">Order Summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-semibold text-navy">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="font-semibold text-navy">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div className="flex items-center gap-2 rounded-2xl bg-surface p-3">
              <input value={discountCode} onChange={(event) => setDiscountCode(event.target.value)} placeholder="Discount code" className="w-full bg-transparent outline-none" />
              <button type="button" onClick={applyDiscount} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">Apply</button>
            </div>
            <div className="flex justify-between"><span className="text-muted">Discount</span><span className="font-semibold text-red">-{formatPrice(discountAmount)}</span></div>
            <div className="border-t border-navy/10 pt-3 flex justify-between text-lg"><span className="font-semibold text-navy">Total</span><span className="font-bold text-navy">{formatPrice(total)}</span></div>
          </div>
          <Link to="/checkout" className="mt-6 block rounded-full bg-gold px-5 py-4 text-center font-bold text-navy transition hover:bg-[#d8b53c]">Checkout</Link>
          <button type="button" onClick={clearCart} className="mt-3 w-full rounded-full border-2 border-navy px-5 py-4 font-bold text-navy transition hover:bg-navy hover:text-white">Clear Cart</button>
        </aside>
      </div>
    </div>
  )
}
