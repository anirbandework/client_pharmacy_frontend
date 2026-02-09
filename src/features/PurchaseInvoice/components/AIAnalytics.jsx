import React, { useState, useEffect } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { Brain, TrendingUp, AlertCircle, Target, Search, Package, Calendar, TrendingDown } from 'lucide-react'

const AIAnalytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [itemCode, setItemCode] = useState('')
  const [itemAnalysis, setItemAnalysis] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [monthsAhead, setMonthsAhead] = useState(3)

  useEffect(() => {
    fetchAIData()
    fetchPredictions()
  }, [])

  useEffect(() => {
    fetchPredictions()
  }, [monthsAhead])

  const fetchAIData = async () => {
    setLoading(true)
    try {
      const response = await invoiceAPI.getAIComprehensive()
      setData(response.data)
    } catch (error) {
      console.error('AI Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPredictions = async () => {
    try {
      const response = await invoiceAPI.getStockPredictions(monthsAhead)
      setPredictions(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Predictions error:', error)
    }
  }

  const handleItemAnalysis = async () => {
    if (!itemCode.trim()) return
    try {
      const response = await invoiceAPI.analyzeItemMovement(itemCode)
      setItemAnalysis(response.data)
    } catch (error) {
      alert('Error analyzing item: ' + (error.response?.data?.detail || error.message))
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Brain className="w-10 h-10 md:w-12 md:h-12 text-primary-600 animate-pulse mb-3" />
        <div className="text-sm md:text-base text-gray-600">AI analyzing inventory...</div>
      </div>
    )
  }

  if (!data) return <div className="text-center py-12 text-sm text-gray-500">No AI data available</div>

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl shadow-lg p-4 md:p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <Brain className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold">AI Analytics</h2>
            <p className="text-white/90 text-xs">Intelligent inventory insights & predictions</p>
          </div>
        </div>
      </div>

      {/* Item Movement Analysis */}
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
        <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3">Analyze Item Movement</h3>
        <div className="flex gap-2">
          <input type="text" placeholder="Enter item code" value={itemCode} onChange={(e) => setItemCode(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400" />
          <button onClick={handleItemAnalysis} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 text-sm font-semibold flex items-center gap-2">
            <Search className="w-4 h-4" /> Analyze
          </button>
        </div>
        {itemAnalysis && (
          <div className="mt-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm text-gray-700">{typeof itemAnalysis === 'string' ? itemAnalysis : 'Analysis complete. Check the data above.'}</div>
          </div>
        )}
      </div>

      {/* Stock Predictions */}
      {predictions && predictions.length > 0 && (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900">Stock Predictions</h3>
            <select value={monthsAhead} onChange={(e) => setMonthsAhead(Number(e.target.value))} className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg">
              <option value={1}>1 Month</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{item.item_name}</div>
                    <div className="text-xs text-gray-600">Code: {item.item_code}</div>
                  </div>
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-xs text-gray-500">Current Stock</div>
                    <div className="text-lg font-bold text-gray-900">{item.current_stock || 0}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-xs text-gray-500">Avg Monthly Use</div>
                    <div className="text-lg font-bold text-gray-900">{(item.average_monthly_consumption || 0).toFixed(1)}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Predictions:</div>
                  {item.predictions?.map((pred, j) => (
                    <div key={j} className="flex items-center justify-between bg-white rounded-lg p-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-blue-600" />
                        <span className="font-medium">{pred.month}</span>
                      </div>
                      <div className="flex gap-3">
                        <div>
                          <span className="text-gray-500">Use:</span>
                          <span className="font-semibold ml-1">{pred.predicted_consumption || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <span className="font-semibold ml-1">{pred.recommended_stock || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{data.movement_patterns?.length || 0}</div>
          <div className="text-xs text-gray-500">Movement Patterns</div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{data.seasonal_trends?.length || 0}</div>
          <div className="text-xs text-gray-500">Seasonal Trends</div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{data.expiry_predictions?.length || 0}</div>
          <div className="text-xs text-gray-500">Expiry Predictions</div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{data.stock_recommendations?.length || 0}</div>
          <div className="text-xs text-gray-500">Recommendations</div>
        </div>
      </div>

      {/* No Data Message */}
      {(!predictions || predictions.length === 0) && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-soft border-2 border-indigo-200 p-6 text-center">
          <Brain className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
          <div className="text-lg font-bold text-gray-900 mb-2">AI Learning in Progress</div>
          <div className="text-sm text-gray-600 mb-4">The AI needs sales data to generate predictions and insights.</div>
          <div className="text-xs text-gray-500">Start recording sales to see:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Movement patterns and trends</li>
              <li>Stock consumption predictions</li>
              <li>Intelligent recommendations</li>
              <li>Seasonal analysis</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIAnalytics
