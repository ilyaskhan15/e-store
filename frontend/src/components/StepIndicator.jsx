import { cn } from '@/utils/cn'

const steps = ['Shipping Address', 'Shipping Method', 'Payment', 'Confirmation']

export default function StepIndicator({ currentStep }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[640px] items-center justify-between gap-3">
        {steps.map((step, index) => {
          const active = index <= currentStep
          return (
            <div key={step} className="flex flex-1 items-center gap-3 last:flex-[0_0_auto]">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition', active ? 'border-navy bg-navy text-white' : 'border-navy/20 bg-white text-muted')}>
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className={cn('text-sm font-semibold', active ? 'text-navy' : 'text-muted')}>{step}</p>
              </div>
              {index < steps.length - 1 ? <div className={cn('h-1 flex-1 rounded-full', active ? 'bg-navy' : 'bg-navy/15')} /> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
