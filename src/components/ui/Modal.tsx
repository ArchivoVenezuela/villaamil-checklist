import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-xl border border-[#e8e6e1] w-full max-w-md animate-in fade-in zoom-in-95 duration-200',
          className,
        )}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#e8e6e1]">
          <h2 className="text-lg font-semibold text-[#1c2b3a]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#888888] hover:text-[#1c2b3a] hover:bg-[#f7f6f3] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
