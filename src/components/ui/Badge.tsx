import { ReactNode } from 'react'
import { cn, getStatusColor } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'status'
  status?: string
  className?: string
}

export default function Badge({ 
  children, 
  variant = 'default', 
  status,
  className 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  
  let variantStyles = 'bg-gray-100 text-gray-800'
  
  if (variant === 'status' && status) {
    variantStyles = getStatusColor(status)
  }

  return (
    <span className={cn(baseStyles, variantStyles, className)}>
      {children}
    </span>
  )
}