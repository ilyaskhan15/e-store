import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="font-heading text-9xl text-navy">404</p>
      <h1 className="mt-2 text-6xl text-navy">Page Not Found</h1>
      <p className="mt-4 text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 rounded-full bg-gold px-5 py-3 font-bold text-navy">Return Home</Link>
    </div>
  )
}
