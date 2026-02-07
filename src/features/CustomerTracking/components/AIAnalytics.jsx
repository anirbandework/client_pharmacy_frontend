import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react'

const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const { data } = await customerTrackingAPI.getAIAnalytics(days)
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch AI analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading AI insights...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          AI-Powered Analytics - {analytics?.period}
        </h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 border rounded"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {analytics && (
        <>
          {/* AI Insights */}
          {analytics.ai_insights && analytics.ai_insights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.ai_insights.map((insight, idx) => (
                <div key={idx} className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                  insight.priority === 'high' ? 'border-red-500' :
                  insight.priority === 'medium' ? 'border-yellow-500' : 'border-blue-500'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{insight.category}</p>
                      <p className="text-xs text-gray-600 mt-1">{insight.insight}</p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-blue-50 rounded">
                    <p className="text-xs text-blue-800">{insight.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Revenue Analysis */}
          {analytics.revenue_analysis && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
              <h3 className="font-semibold mb-3">Revenue Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm opacity-90">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{analytics.revenue_analysis.total_revenue}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Transactions</p>
                  <p className="text-2xl font-bold">{analytics.revenue_analysis.total_transactions}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Avg Transaction</p>
                  <p className="text-2xl font-bold">₹{analytics.revenue_analysis.avg_transaction_value.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Generic Revenue</p>
                  <p className="text-2xl font-bold">₹{analytics.revenue_analysis.revenue_by_type.generic}</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Behavior */}
          {analytics.customer_behavior && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Customer Behavior</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold">{analytics.customer_behavior.total_customers}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-sm text-gray-600">New Customers</p>
                  <p className="text-2xl font-bold">{analytics.customer_behavior.new_customers_period}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <p className="text-sm text-gray-600">Repeat Rate</p>
                  <p className="text-2xl font-bold">{analytics.customer_behavior.repeat_customer_rate.toFixed(1)}%</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <p className="text-sm text-gray-600">Avg Purchase</p>
                  <p className="text-2xl font-bold">₹{analytics.customer_behavior.avg_purchase_value.toFixed(2)}</p>
                </div>
              </div>
              {analytics.customer_behavior.top_customers && (
                <div>
                  <h4 className="font-medium mb-2">Top Customers</h4>
                  <div className="space-y-2">
                    {analytics.customer_behavior.top_customers.slice(0, 5).map((customer, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{customer.name}</p>
                          <p className="text-xs text-gray-600">{customer.phone} • {customer.total_visits} visits</p>
                        </div>
                        <p className="font-bold text-green-600">₹{customer.lifetime_value.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Medicine Analytics */}
          {analytics.medicine_analytics && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Medicine Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Top Selling Medicines</h4>
                  <div className="space-y-2">
                    {analytics.medicine_analytics.top_selling_medicines.slice(0, 5).map((med, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{med.medicine_name}</p>
                          <p className="text-xs text-gray-600">{med.sales_count} sales • {med.total_quantity} units</p>
                        </div>
                        <p className="font-bold text-blue-600">₹{med.total_revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Generic vs Branded</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded">
                      <p className="text-sm text-gray-600">Generic</p>
                      <p className="text-xl font-bold">{analytics.medicine_analytics.generic_vs_branded.generic_percentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">{analytics.medicine_analytics.generic_vs_branded.generic_count} items</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-sm text-gray-600">Branded</p>
                      <p className="text-xl font-bold">{analytics.medicine_analytics.generic_vs_branded.branded_percentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">{analytics.medicine_analytics.generic_vs_branded.branded_count} items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conversion Funnel */}
          {analytics.conversion_funnel && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Conversion Funnel</h3>
              <div className="space-y-3">
                {analytics.conversion_funnel.funnel_stages.map((stage, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{stage.stage}</span>
                      <span className="font-medium">{stage.count} ({stage.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stage.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff Performance */}
          {analytics.staff_performance && analytics.staff_performance.performance_by_staff && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Staff Performance</h3>
              <div className="space-y-2">
                {analytics.staff_performance.performance_by_staff.map((staff, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-xs text-gray-600">{staff.staff_code}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {staff.conversion_rate}% conversion
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">Contacts</p>
                        <p className="font-bold">{staff.contacts_assigned}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Conversions</p>
                        <p className="font-bold">{staff.conversions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Interactions</p>
                        <p className="font-bold">{staff.total_interactions}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AIAnalytics
