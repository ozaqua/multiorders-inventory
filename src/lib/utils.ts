import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'new': 'bg-blue-100 text-blue-800',
    'prepared': 'bg-yellow-100 text-yellow-800', 
    'in-progress': 'bg-orange-100 text-orange-800',
    'pending': 'bg-gray-100 text-gray-800',
    'shipped': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'low-stock': 'bg-yellow-100 text-yellow-800',
    'out-of-stock': 'bg-red-100 text-red-800'
  }
  return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}