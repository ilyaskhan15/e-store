import { Minus, Plus } from 'lucide-react'

export default function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-navy/15 bg-white">
      <button type="button" className="px-3 py-2 text-navy transition hover:bg-surface" onClick={() => onChange(Math.max(min, value - 1))}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-10 px-3 text-center font-semibold text-navy">{value}</span>
      <button type="button" className="px-3 py-2 text-navy transition hover:bg-surface" onClick={() => onChange(Math.min(max, value + 1))}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
