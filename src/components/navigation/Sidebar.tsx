'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home,
  BarChart3,
  ShoppingCart,
  Tag,
  Users,
  Package,
  GitMerge,
  Archive,
  Wrench,
  Zap,
  FileText,
  DollarSign,
  Truck,
  Settings,
  Plug
} from 'lucide-react'

const navigation = [
  {
    name: 'GENERAL',
    items: [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    ]
  },
  {
    name: 'ORDERS & SHIPPING', 
    items: [
      { name: 'Orders', href: '/orders', icon: ShoppingCart },
      { name: 'Labels & Manifests', href: '/labels', icon: Tag },
      { name: 'Customers', href: '/customers', icon: Users },
    ]
  },
  {
    name: 'PRODUCTS & INVENTORY',
    items: [
      { name: 'Products', href: '/products', icon: Package },
      { name: 'Product merge', href: '/merge', icon: GitMerge },
      { name: 'Inventory', href: '/inventory', icon: Archive },
      { name: 'Listing Tools', href: '/listing-tools', icon: Wrench },
    ]
  },
  {
    name: 'PURCHASING',
    items: [
      { name: 'Purchases', href: '/purchases', icon: DollarSign },
      { name: 'Suppliers', href: '/suppliers', icon: Truck },
    ]
  },
  {
    name: 'TOOLS',
    items: [
      { name: 'Automation', href: '/automation', icon: Zap },
      { name: 'Reports', href: '/reports', icon: FileText },
      { name: 'Integrations', href: '/integrations', icon: Plug },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">I+</span>
          </div>
          <span className="text-xl font-semibold text-blue-600">INVENTREE PLUS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8 px-4 py-6 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.name}>
            <h3 className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              {section.name}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}