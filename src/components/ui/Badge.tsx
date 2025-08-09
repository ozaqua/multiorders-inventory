import { ReactNode } from 'react'
import { cn, getStatusColor } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'status' | 'success' | 'warning' | 'error' | 'info' | 'secondary'
  status?: string
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  className?: string
}

export default function Badge({ 
  children, 
  variant = 'default', 
  status,
  size = 'md',
  dot = false,
  className 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full font-medium transition-colors'
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
    lg: 'px-3 py-1 text-sm gap-2'
  }

  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    error: 'bg-red-100 text-red-800 hover:bg-red-200',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    status: ''
  }

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  }

  let variantStyles = variants[variant]
  
  if (variant === 'status' && status) {
    variantStyles = getStatusColor(status)
  }

  const DotIndicator = () => (
    <span className={cn('rounded-full bg-current opacity-75', dotSizes[size])} />
  )

  return (
    <span className={cn(baseStyles, variantStyles, sizes[size], className)}>
      {dot && <DotIndicator />}
      {children}
    </span>
  )
}