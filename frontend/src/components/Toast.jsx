import { CheckCircle2, Info, XCircle, X } from 'lucide-react'

import { useToastStore } from '@/store/toastStore'
import { cn } from '@/utils/cn'

const typeStyles = {
  success: 'border-success/25 bg-success/10 text-success',
  error: 'border-red/25 bg-red/10 text-red',
  info: 'border-info/25 bg-info/10 text-info',
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || Info
        return (
          <div key={toast.id} className={cn('flex items-start gap-3 rounded-2xl border p-4 shadow-luxe backdrop-blur', typeStyles[toast.type])}>
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{toast.title}</p>
              <p className="text-sm opacity-90">{toast.message}</p>
            </div>
            <button type="button" onClick={() => removeToast(toast.id)} className="rounded-full p-1 transition hover:bg-black/5">
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
