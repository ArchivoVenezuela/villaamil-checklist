import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  trackClassName?: string
  size?: 'sm' | 'md'
}

export function Progress({ value, className, trackClassName, size = 'md' }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const isComplete = clamped === 100

  return (
    <div
      className={cn(
        'w-full bg-[#e8e6e1] rounded-full overflow-hidden',
        size === 'sm' ? 'h-1.5' : 'h-2',
        trackClassName,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          isComplete ? 'bg-[#3d7a5c]' : 'bg-[#1c2b3a]',
          className,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
