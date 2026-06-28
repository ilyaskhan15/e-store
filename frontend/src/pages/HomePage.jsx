import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BadgeCheck, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

import ProductCard from '@/components/ProductCard'
import SkeletonCard from '@/components/SkeletonCard'
import { useCategories } from '@/hooks/useCategories'
import { useProducts } from '@/hooks/useProducts'
import { cn } from '@/utils/cn'
import { trustBadges } from '@/utils/constants'

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  useEffect(() => {
    const target = new Date()
    target.setHours(target.getHours() + 12)

    const tick = () => {
      const diff = Math.max(target.getTime() - Date.now(), 0)
      const hours = String(Math.floor(diff / 3600000)).padStart(2, '0')
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      setTimeLeft(`${hours}:${minutes}:${seconds}`)
    }

    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return timeLeft
}

export default function HomePage() {
  const { data: featuredData, isLoading } = useProducts({ is_featured: true, page: 1 })
  const { data: categoriesData } = useCategories()
  const countdown = useCountdown()
  const featuredProducts = featuredData?.results || []
  const categories = categoriesData?.results || []
  const nationalTeams = useMemo(
    () => featuredProducts.filter((product) => product.national_team).slice(0, 6),
    [featuredProducts]
  )

  return (
    <div>
      <section className="bg-hero-grid px-4 py-16 text-white lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-gold">Official fanwear drops</p>
            <h1 className="mt-6 max-w-4xl text-7xl leading-[0.9] text-white md:text-8xl">Wear Your Nation&apos;s Pride</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">Premium FIFA-inspired kits and supporter tees with fast fulfillment, bold designs, and conversion-focused merchandising.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-bold text-navy transition hover:bg-[#d8b53c]">Shop Now <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 font-bold text-white transition hover:border-gold hover:text-gold">Browse Kits</Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-luxe backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              {['Brazil', 'France', 'England', 'Argentina'].map((team, index) => (
                <div key={team} className={cn('rounded-3xl p-4', index % 2 === 0 ? 'bg-gold/15' : 'bg-white/10')}>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">National kit</p>
                  <p className="mt-8 font-heading text-5xl text-white">{team}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Featured Kits</p>
            <h2 className="text-6xl text-navy">National Team Picks</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-sm font-semibold text-navy transition hover:text-red md:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {(isLoading ? Array.from({ length: 6 }) : nationalTeams.length ? nationalTeams : featuredProducts.slice(0, 6)).map((product, index) => (
            <div key={product?.id || index} className="min-w-[240px] max-w-[240px] flex-1">
              {product ? (
                <div className="overflow-hidden rounded-3xl bg-white shadow-luxe">
                  <img src={product.primary_image || '/src/assets/logo-mark.svg'} loading="lazy" alt={product.name} className="h-72 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted">{product.national_team || product.club_name}</p>
                    <h3 className="font-heading text-4xl text-navy">{product.name}</h3>
                  </div>
                </div>
              ) : (
                <SkeletonCard />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'World Cup Kits', slug: 'world-cup-kits', image: 'bg-[linear-gradient(135deg,rgba(26,31,58,0.82),rgba(230,57,70,0.55))]' },
            { title: 'Club Kits', slug: 'club-kits', image: 'bg-[linear-gradient(135deg,rgba(26,31,58,0.82),rgba(232,197,71,0.55))]' },
            { title: 'Training Jerseys', slug: 'training-jerseys', image: 'bg-[linear-gradient(135deg,rgba(26,31,58,0.82),rgba(59,130,246,0.5))]' },
            { title: 'Fan T-Shirts', slug: 'fan-t-shirts', image: 'bg-[linear-gradient(135deg,rgba(26,31,58,0.82),rgba(34,197,94,0.45))]' },
          ].map((category) => (
            <Link key={category.title} to={`/shop?category=${category.slug}`} className={`group relative overflow-hidden rounded-[2rem] p-6 text-white shadow-luxe ${category.image}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
              <div className="relative flex min-h-60 flex-col justify-between">
                <div className="flex justify-end">
                  <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/80">Category</p>
                  <h3 className="mt-3 max-w-48 text-6xl leading-none">{category.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="rounded-[2rem] bg-red px-6 py-5 text-white shadow-luxe">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Flash Sale Ends In</p>
              <h2 className="text-6xl">Limited time pricing</h2>
            </div>
            <div className="font-heading text-6xl text-white md:text-7xl">{countdown}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Free Shipping', detail: 'Orders over $50 ship free.' },
            { icon: RotateCcw, title: '30-Day Returns', detail: 'Simple, customer-friendly returns.' },
            { icon: BadgeCheck, title: 'Authentic Designs', detail: 'Sharp details and premium printing.' },
            { icon: ShieldCheck, title: 'Secure Checkout', detail: 'Encrypted payments and order protection.' },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.75rem] bg-white p-5 shadow-luxe">
              <item.icon className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-heading text-4xl text-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Bestsellers</p>
            <h2 className="text-6xl text-navy">Fan Favorites</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-red">Browse more <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {(featuredData?.results || Array.from({ length: 8 })).slice(0, 8).map((product, index) => (
            product ? <ProductCard key={product.id} product={product} /> : <SkeletonCard key={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-luxe md:grid-cols-4">
          {trustBadges.map((badge) => (
            <div key={badge} className="rounded-2xl bg-surface px-4 py-4 text-center text-sm font-semibold uppercase tracking-[0.25em] text-navy">{badge}</div>
          ))}
        </div>
      </section>
    </div>
  )
}
