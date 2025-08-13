'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Zap,
  Play,
  Pause,
  Settings,
  Plus,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Bot,
  ArrowRight,
  Calendar,
  Timer,
  Activity
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Client component - uses dynamic data fetching

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    type: 'schedule' | 'inventory_low' | 'order_status' | 'price_change'
    conditions: string
  }
  actions: {
    type: 'update_inventory' | 'send_email' | 'create_order' | 'sync_prices'
    description: string
  }[]
  status: 'active' | 'paused' | 'error'
  lastRun?: string
  nextRun?: string
  runCount: number
  successCount: number
  errorCount: number
  createdAt: string
}

interface AutomationLog {
  id: string
  ruleId: string
  ruleName: string
  status: 'success' | 'error' | 'running'
  message: string
  executedAt: string
  duration?: number
}

const mockRules: AutomationRule[] = [
  {
    id: 'AUTO-001',
    name: 'Low Stock Reorder Alert',
    description: 'Send email alert when inventory falls below reorder point',
    trigger: {
      type: 'inventory_low',
      conditions: 'Stock level < Reorder Point'
    },
    actions: [
      {
        type: 'send_email',
        description: 'Send low stock alert to purchasing team'
      }
    ],
    status: 'active',
    lastRun: '2024-01-15T08:30:00Z',
    nextRun: '2024-01-16T08:30:00Z',
    runCount: 156,
    successCount: 152,
    errorCount: 4,
    createdAt: '2023-09-15T10:00:00Z'
  },
  {
    id: 'AUTO-002',
    name: 'Daily Inventory Sync',
    description: 'Sync inventory levels across all sales channels',
    trigger: {
      type: 'schedule',
      conditions: 'Daily at 9:00 AM'
    },
    actions: [
      {
        type: 'update_inventory',
        description: 'Update inventory on eBay, Amazon, Shopify'
      },
      {
        type: 'sync_prices',
        description: 'Synchronize pricing across platforms'
      }
    ],
    status: 'active',
    lastRun: '2024-01-15T09:00:00Z',
    nextRun: '2024-01-16T09:00:00Z',
    runCount: 95,
    successCount: 93,
    errorCount: 2,
    createdAt: '2023-10-20T14:30:00Z'
  },
  {
    id: 'AUTO-003',
    name: 'Order Status Update',
    description: 'Auto-update order status when tracking shows delivered',
    trigger: {
      type: 'order_status',
      conditions: 'Tracking status = Delivered'
    },
    actions: [
      {
        type: 'send_email',
        description: 'Send delivery confirmation to customer'
      }
    ],
    status: 'paused',
    lastRun: '2024-01-12T16:45:00Z',
    runCount: 234,
    successCount: 230,
    errorCount: 4,
    createdAt: '2023-11-05T11:20:00Z'
  },
  {
    id: 'AUTO-004',
    name: 'Price Adjustment Monitor',
    description: 'Monitor competitor prices and adjust accordingly',
    trigger: {
      type: 'price_change',
      conditions: 'Competitor price change detected'
    },
    actions: [
      {
        type: 'sync_prices',
        description: 'Adjust prices to maintain competitiveness'
      }
    ],
    status: 'error',
    lastRun: '2024-01-14T12:00:00Z',
    runCount: 67,
    successCount: 58,
    errorCount: 9,
    createdAt: '2023-12-01T09:45:00Z'
  }
]

const mockLogs: AutomationLog[] = [
  {
    id: 'LOG-001',
    ruleId: 'AUTO-002',
    ruleName: 'Daily Inventory Sync',
    status: 'success',
    message: 'Successfully synced inventory for 89 products across 3 platforms',
    executedAt: '2024-01-15T09:00:00Z',
    duration: 45000
  },
  {
    id: 'LOG-002',
    ruleId: 'AUTO-001',
    ruleName: 'Low Stock Reorder Alert',
    status: 'success',
    message: 'Alert sent for 3 products below reorder point',
    executedAt: '2024-01-15T08:30:00Z',
    duration: 2000
  },
  {
    id: 'LOG-003',
    ruleId: 'AUTO-004',
    ruleName: 'Price Adjustment Monitor',
    status: 'error',
    message: 'Failed to connect to competitor API - timeout after 30s',
    executedAt: '2024-01-14T12:00:00Z',
    duration: 30000
  },
  {
    id: 'LOG-004',
    ruleId: 'AUTO-003',
    ruleName: 'Order Status Update',
    status: 'success',
    message: 'Updated status for 12 orders, sent 12 delivery confirmations',
    executedAt: '2024-01-12T16:45:00Z',
    duration: 8000
  }
]

export const dynamic = 'force-dynamic'

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'logs' | 'templates'>('rules')
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [logs, setLogs] = useState<AutomationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        setRules(mockRules)
        setLogs(mockLogs)
      } catch (err) {
        console.error('Error fetching automation data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: string, type?: 'rule' | 'log') => {
    if (type === 'rule') {
      const variants = {
        active: 'success' as const,
        paused: 'warning' as const,
        error: 'error' as const
      }
      return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>
    }
    
    if (type === 'log') {
      const variants = {
        success: 'success' as const,
        error: 'error' as const,
        running: 'info' as const
      }
      return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>
    }

    return <Badge>{status}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'paused':
        return <Pause className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Calendar className="h-4 w-4" />
      case 'inventory_low':
        return <AlertTriangle className="h-4 w-4" />
      case 'order_status':
        return <CheckCircle className="h-4 w-4" />
      case 'price_change':
        return <Activity className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' as const }
        : rule
    ))
  }

  const handleRunRule = (ruleId: string) => {
    console.log('Running rule:', ruleId)
    // Simulate rule execution
    const newLog: AutomationLog = {
      id: `LOG-${Date.now()}`,
      ruleId,
      ruleName: rules.find(r => r.id === ruleId)?.name || 'Unknown Rule',
      status: 'running',
      message: 'Execution started...',
      executedAt: new Date().toISOString()
    }
    setLogs(prev => [newLog, ...prev])

    // Simulate completion after 3 seconds
    setTimeout(() => {
      setLogs(prev => prev.map(log => 
        log.id === newLog.id 
          ? { ...log, status: 'success' as const, message: 'Execution completed successfully', duration: 3000 }
          : log
      ))
      setRules(prev => prev.map(rule => 
        rule.id === ruleId 
          ? { 
              ...rule, 
              lastRun: new Date().toISOString(), 
              runCount: rule.runCount + 1,
              successCount: rule.successCount + 1
            }
          : rule
      ))
    }, 3000)
  }

  const handleViewDetails = (rule: AutomationRule) => {
    setSelectedRule(rule)
    setShowDetails(true)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading automation...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Automation</h1>
          <p className="text-sm text-gray-600 mt-1">
            Automate repetitive tasks and streamline your workflow
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Rule
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {rules.length}
                </div>
                <div className="text-sm text-gray-500">Total Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {rules.filter(r => r.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Pause className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {rules.filter(r => r.status === 'paused').length}
                </div>
                <div className="text-sm text-gray-500">Paused</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {rules.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-gray-500">Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'rules', label: 'Rules', count: rules.length },
            { id: 'logs', label: 'Activity Log', count: logs.length },
            { id: 'templates', label: 'Templates', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'rules' | 'logs' | 'templates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(rule.status)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        {getStatusBadge(rule.status, 'rule')}
                        <span className="text-sm text-gray-500">
                          {rule.runCount} executions
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(rule)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRunRule(rule.id)}
                      disabled={rule.status === 'error'}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Run Now
                    </Button>
                    <Button
                      variant={rule.status === 'active' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleRule(rule.id)}
                    >
                      {rule.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Rule Flow */}
                <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getTriggerIcon(rule.trigger.type)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">Trigger</div>
                      <div className="text-sm text-gray-600">{rule.trigger.conditions}</div>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">Actions</div>
                    <div className="space-y-1">
                      {rule.actions.map((action, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {index + 1}. {action.description}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Execution Stats */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Last Run</div>
                    <div className="font-medium text-gray-900">
                      {rule.lastRun ? formatDate(rule.lastRun) : 'Never'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Next Run</div>
                    <div className="font-medium text-gray-900">
                      {rule.nextRun ? formatDate(rule.nextRun) : 'Manual only'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Success Rate</div>
                    <div className="font-medium text-gray-900">
                      {rule.runCount > 0 ? Math.round((rule.successCount / rule.runCount) * 100) : 0}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Errors</div>
                    <div className={`font-medium ${rule.errorCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {rule.errorCount}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusBadge(log.status, 'log')}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{log.ruleName}</h4>
                      <p className="text-sm text-gray-600">{log.message}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{formatDate(log.executedAt)}</div>
                    {log.duration && (
                      <div className="flex items-center space-x-1">
                        <Timer className="h-3 w-3" />
                        <span>{(log.duration / 1000).toFixed(1)}s</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Rule Templates</h3>
          <p className="mt-1 text-sm text-gray-500">
            Pre-built automation templates to help you get started quickly.
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Automation Rule</h2>
                <p className="text-sm text-gray-500">{selectedRule.name}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Rule Configuration</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <div className="text-sm text-gray-900">{selectedRule.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedRule.status, 'rule')}</div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <div className="text-sm text-gray-900">{selectedRule.description}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Trigger</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTriggerIcon(selectedRule.trigger.type)}
                      <span className="font-medium text-gray-900">
                        {selectedRule.trigger.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{selectedRule.trigger.conditions}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-3">
                    {selectedRule.actions.map((action, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-medium text-gray-900">
                          Step {index + 1}: {action.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Execution History</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedRule.runCount}</div>
                      <div className="text-sm text-gray-600">Total Runs</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedRule.successCount}</div>
                      <div className="text-sm text-gray-600">Successful</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Rule
                </Button>
                <Button variant="primary" onClick={() => {
                  handleRunRule(selectedRule.id)
                  setShowDetails(false)
                }}>
                  <Play className="h-4 w-4 mr-2" />
                  Run Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {rules.length === 0 && !loading && (
        <div className="text-center py-12">
          <Zap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No automation rules</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first automation rule.
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}