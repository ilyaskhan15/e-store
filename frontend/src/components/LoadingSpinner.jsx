export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-12 w-12 animate-pulse rounded-full border-4 border-gold border-t-transparent" aria-label="Loading" />
    </div>
  )
}
