import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-heading text-5xl text-gold">FIFA KIT</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">Premium football kits and fan apparel engineered for fast, reliable dropshipping fulfillment.</p>
        </div>
        <div>
          <h3 className="font-heading text-4xl text-gold">About</h3>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p>Production-ready storefront for national teams, club kits, and supporter wear.</p>
            <p>Built for conversion, performance, and mobile-first shopping.</p>
          </div>
        </div>
        <div>
          <h3 className="font-heading text-4xl text-gold">Shop</h3>
          <div className="mt-4 space-y-3 text-sm">
            <Link to="/shop" className="block text-white/75 transition hover:text-gold">All Products</Link>
            <Link to="/shop?category=World Cup Kits" className="block text-white/75 transition hover:text-gold">World Cup Kits</Link>
            <Link to="/shop?category=Club Kits" className="block text-white/75 transition hover:text-gold">Club Kits</Link>
            <Link to="/shop?category=Fan T-Shirts" className="block text-white/75 transition hover:text-gold">Fan T-Shirts</Link>
          </div>
        </div>
        <div>
          <h3 className="font-heading text-4xl text-gold">Support</h3>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p>Free shipping over $50</p>
            <p>30-day return window</p>
            <p>Secure checkout and order tracking</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
