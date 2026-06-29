import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-[#f7f6f3]', className)}>
      <div className="max-w-2xl mx-auto px-4 pb-16">{children}</div>
    </div>
  )
}
