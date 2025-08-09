import { HTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, ...props }, ref) => {
    const baseStyles = 'rounded-lg transition-all duration-200'
    
    const variants = {
      default: 'bg-white border border-gray-200',
      elevated: 'bg-white shadow-md border border-gray-100',
      outlined: 'bg-white border-2 border-gray-300',
      filled: 'bg-gray-50 border border-gray-200'
    }
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }

    const hoverStyles = hover 
      ? 'hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5 cursor-pointer' 
      : ''

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles, 
          variants[variant], 
          paddings[padding], 
          hoverStyles, 
          className
        )}
        {...props}
      />
    )
  }
)

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
)

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-gray-600', className)}
      {...props}
    />
  )
)

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4 border-t border-gray-100', className)}
      {...props}
    />
  )
)

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}
      {...props}
    />
  )
)

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-500', className)}
      {...props}
    />
  )
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'
CardTitle.displayName = 'CardTitle'
CardDescription.displayName = 'CardDescription'

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription }