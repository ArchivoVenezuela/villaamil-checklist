import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#1c2b3a] text-white hover:bg-[#243547] active:bg-[#131d28] shadow-sm',
  secondary:
    'bg-white text-[#1c2b3a] border border-[#e8e6e1] hover:bg-[#f7f6f3] active:bg-[#edecea] shadow-sm',
  ghost:
    'bg-transparent text-[#1c2b3a] hover:bg-[#f0eeeb] active:bg-[#e8e6e1]',
  danger:
    'bg-[#c0392b] text-white hover:bg-[#a93226] active:bg-[#922b21] shadow-sm',
  success:
    'bg-[#3d7a5c] text-white hover:bg-[#346849] active:bg-[#2c5a3f] shadow-sm',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3.5 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c2b3a] focus-visible:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
