import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import EmptyState from '@/components/EmptyState'
import StepIndicator from '@/components/StepIndicator'
import { useCreateOrder } from '@/hooks/useOrders'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import { formatPrice } from '@/utils/formatPrice'

const initialShipping = {
  shipping_name: '',
  shipping_email: '',
  shipping_address: '',
  shipping_city: '',
  shipping_country: '',
  shipping_postal: '',
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const subtotal = useCartStore((state) => state.cartTotal())
  const [step, setStep] = useState(0)
  const [shippingForm, setShippingForm] = useState(initialShipping)
  const [shippingMethod, setShippingMethod] = useState('Standard Shipping')
  const [discountCode, setDiscountCode] = useState('')
  const createOrder = useCreateOrder()
  const pushToast = useToastStore((state) => state.pushToast)

  const shippingCost = subtotal >= 50 ? 0 : 5.99
  const total = useMemo(() => Math.max(subtotal + shippingCost, 0), [subtotal, shippingCost])

  if (!items.length) {
    return <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8"><EmptyState title="Nothing to checkout" description="Your cart is empty. Add some kits before placing an order." action={<button onClick={() => navigate('/shop')} className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Shop Now</button>} /></div>
  }

  const handleContinue = () => {
    if (step < 3) setStep((current) => current + 1)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...shippingForm,
        shipping_method: shippingMethod,
        discount_code: discountCode,
        items: items.map((item) => ({ product: item.product.id, size: item.size, quantity: item.quantity })),
      }
      const response = await createOrder.mutateAsync(payload)
      clearCart()
      pushToast({ type: 'success', title: 'Order placed', message: `Order ${response.order_number} was created successfully.` })
      navigate('/account')
    } catch (error) {
      pushToast({ type: 'error', title: 'Checkout failed', message: error?.response?.data?.detail || 'Please review your details and try again.' })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Checkout</p>
        <h1 className="text-7xl text-navy">Secure Checkout</h1>
      </div>

      <StepIndicator currentStep={step} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[2rem] bg-white p-6 shadow-luxe">
          {step === 0 ? (
            <div className="space-y-4">
              <h2 className="font-heading text-5xl text-navy">Shipping Address</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(shippingForm).map(([field, value]) => (
                  <input key={field} value={value} onChange={(event) => setShippingForm((current) => ({ ...current, [field]: event.target.value }))} placeholder={field.replaceAll('_', ' ')} className="rounded-2xl border border-navy/10 bg-surface px-4 py-3 outline-none" />
                ))}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="font-heading text-5xl text-navy">Shipping Method</h2>
              <label className="flex items-center justify-between rounded-3xl border border-navy/10 bg-surface px-5 py-4">
                <div>
                  <p className="font-semibold text-navy">Standard Shipping</p>
                  <p className="text-sm text-muted">Delivered in 5-8 business days</p>
                </div>
                <input type="radio" checked={shippingMethod === 'Standard Shipping'} onChange={() => setShippingMethod('Standard Shipping')} />
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-navy/10 bg-surface px-5 py-4">
                <div>
                  <p className="font-semibold text-navy">Express Shipping</p>
                  <p className="text-sm text-muted">Delivered in 2-4 business days</p>
                </div>
                <input type="radio" checked={shippingMethod === 'Express Shipping'} onChange={() => setShippingMethod('Express Shipping')} />
              </label>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="font-heading text-5xl text-navy">Payment</h2>
              <div className="rounded-[1.75rem] border-2 border-dashed border-navy/15 bg-surface p-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-navy">Stripe Elements Placeholder</p>
                  <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-navy">Test Mode</span>
                </div>
                <div className="space-y-3 rounded-3xl bg-white p-4">
                  <div className="h-12 rounded-2xl bg-surface" />
                  <div className="h-12 rounded-2xl bg-surface" />
                  <div className="h-12 rounded-2xl bg-surface" />
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h2 className="font-heading text-5xl text-navy">Confirmation</h2>
              <div className="rounded-3xl bg-surface p-5 text-sm leading-7 text-muted">
                Confirm your order details and place the order. Your test checkout structure is wired for backend order creation without a live Stripe key.
              </div>
              <div className="rounded-3xl border border-navy/10 bg-white p-5">
                <p className="font-semibold text-navy">{shippingForm.shipping_name}</p>
                <p className="text-sm text-muted">{shippingForm.shipping_address}</p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))} className="rounded-full border-2 border-navy px-5 py-3 font-bold text-navy disabled:opacity-40">Back</button>
            {step < 3 ? (
              <button type="button" onClick={handleContinue} className="rounded-full bg-gold px-5 py-3 font-bold text-navy transition hover:bg-[#d8b53c]">Continue</button>
            ) : (
              <button type="button" onClick={handleSubmit} className="rounded-full bg-navy px-5 py-3 font-bold text-white">Place Order</button>
            )}
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-luxe">
          <h2 className="font-heading text-5xl text-navy">Order Summary</h2>
          <div className="mt-4 space-y-4 text-sm">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex items-start justify-between gap-4 border-b border-navy/10 pb-3 last:border-0">
                <div>
                  <p className="font-semibold text-navy">{item.product.name}</p>
                  <p className="text-muted">Size {item.size} · Qty {item.quantity}</p>
                </div>
                <span className="font-semibold text-navy">{formatPrice(Number(item.product.sale_price || item.product.price || 0) * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-semibold text-navy">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="font-semibold text-navy">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span></div>
            <input value={discountCode} onChange={(event) => setDiscountCode(event.target.value)} placeholder="Discount code" className="w-full rounded-2xl border border-navy/10 bg-surface px-4 py-3 outline-none" />
            <div className="flex justify-between border-t border-navy/10 pt-3 text-lg"><span className="font-semibold text-navy">Total</span><span className="font-bold text-navy">{formatPrice(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
