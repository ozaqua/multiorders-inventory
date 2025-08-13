'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card'
import { 
  Settings,
  User,
  Building,
  Bell,
  Lock,
  CreditCard,
  Truck,
  Globe,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

// Client component - uses dynamic data fetching

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  avatar?: string
  timezone: string
  language: string
}

interface CompanySettings {
  name: string
  address: {
    street: string
    city: string
    postcode: string
    country: string
  }
  phone: string
  email: string
  website: string
  currency: string
  taxNumber: string
}

interface NotificationSettings {
  emailNotifications: {
    orders: boolean
    inventory: boolean
    reports: boolean
    marketing: boolean
  }
  pushNotifications: {
    orders: boolean
    inventory: boolean
    system: boolean
  }
  smsNotifications: {
    urgentAlerts: boolean
    orderUpdates: boolean
  }
}

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'notifications' | 'security' | 'billing' | 'shipping' | 'api'>('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+44 7700 900123',
    role: 'Administrator',
    timezone: 'Europe/London',
    language: 'English'
  })

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'Example Trading Ltd',
    address: {
      street: '123 Business Park',
      city: 'London',
      postcode: 'EC1A 1BB',
      country: 'United Kingdom'
    },
    phone: '+44 20 7123 4567',
    email: 'info@example.com',
    website: 'www.example.com',
    currency: 'GBP',
    taxNumber: 'GB123456789'
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: {
      orders: true,
      inventory: true,
      reports: false,
      marketing: false
    },
    pushNotifications: {
      orders: true,
      inventory: true,
      system: true
    },
    smsNotifications: {
      urgentAlerts: true,
      orderUpdates: false
    }
  })

  const handleSave = async (section: string) => {
    setLoading(true)
    console.log(`Saving ${section} settings...`)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const handleToggleNotification = (type: keyof NotificationSettings, key: string) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key as keyof typeof prev[type]]
      }
    }))
  }

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'api', label: 'API & Webhooks', icon: Globe }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your account preferences and application configuration
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Settings
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id as 'profile' | 'company' | 'notifications' | 'security' | 'billing' | 'shipping' | 'api')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === section.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <section.icon className="h-5 w-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Avatar
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.firstName}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.lastName}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={userProfile.timezone}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Europe/London">London (GMT)</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="America/Los_Angeles">Los Angeles (PST)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={userProfile.language}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    variant="primary" 
                    onClick={() => handleSave('profile')}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>
                  Manage your business information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Phone
                    </label>
                    <input
                      type="tel"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Business Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={companySettings.address.street}
                        onChange={(e) => setCompanySettings(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, street: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={companySettings.address.city}
                          onChange={(e) => setCompanySettings(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, city: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postcode
                        </label>
                        <input
                          type="text"
                          value={companySettings.address.postcode}
                          onChange={(e) => setCompanySettings(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, postcode: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          value={companySettings.address.country}
                          onChange={(e) => setCompanySettings(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, country: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Germany">Germany</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={companySettings.currency}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="GBP">GBP (£)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Number
                    </label>
                    <input
                      type="text"
                      value={companySettings.taxNumber}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, taxNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    variant="primary" 
                    onClick={() => handleSave('company')}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about important events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications.emailNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {key === 'orders' && 'New orders, status updates, and shipping notifications'}
                            {key === 'inventory' && 'Low stock alerts and inventory updates'}
                            {key === 'reports' && 'Weekly and monthly business reports'}
                            {key === 'marketing' && 'Product updates and promotional content'}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleToggleNotification('emailNotifications', key)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications.pushNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {key === 'orders' && 'Real-time notifications for new orders'}
                            {key === 'inventory' && 'Instant alerts for stock issues'}
                            {key === 'system' && 'System maintenance and updates'}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleToggleNotification('pushNotifications', key)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications.smsNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {key === 'urgentAlerts' && 'Urgent Alerts'}
                            {key === 'orderUpdates' && 'Order Updates'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {key === 'urgentAlerts' && 'Critical system alerts and emergencies'}
                            {key === 'orderUpdates' && 'Order status changes and shipping updates'}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleToggleNotification('smsNotifications', key)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    variant="primary" 
                    onClick={() => handleSave('notifications')}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <Button variant="primary" size="sm">
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">2FA Enabled</div>
                        <div className="text-sm text-green-600">Your account is protected with two-factor authentication</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Current Session</div>
                        <div className="text-sm text-gray-500">Chrome on macOS • London, UK • Active now</div>
                      </div>
                      <Badge variant="success">Current</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Mobile App</div>
                        <div className="text-sm text-gray-500">iOS App • London, UK • 2 hours ago</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other tabs would have similar structure but showing placeholder content */}
          {!['profile', 'company', 'notifications', 'security'].includes(activeTab) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {settingsSections.find(s => s.id === activeTab)?.label || 'Settings'}
                </CardTitle>
                <CardDescription>
                  This section is coming soon. Configure your {activeTab} settings here.
                </CardDescription>
              </CardHeader>
              <CardContent className="py-12">
                <div className="text-center">
                  <Settings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {settingsSections.find(s => s.id === activeTab)?.label} Settings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This section will be available in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}