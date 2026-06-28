import { PackageSearch } from 'lucide-react'

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-navy/15 bg-white p-10 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface text-navy">
        <PackageSearch className="h-8 w-8" />
      </div>
      <h3 className="font-heading text-4xl text-navy">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
