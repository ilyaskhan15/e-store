export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-luxe">
      <div className="h-72 animate-pulse bg-gradient-to-br from-navy/10 via-surface to-gold/20" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/2 animate-pulse rounded bg-navy/10" />
        <div className="h-5 w-5/6 animate-pulse rounded bg-navy/10" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-navy/10" />
      </div>
    </div>
  )
}
