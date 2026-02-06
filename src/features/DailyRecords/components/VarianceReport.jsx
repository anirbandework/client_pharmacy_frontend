import React, { useState, useEffect } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'
import { AlertTriangle, TrendingUp, TrendingDown, Filter } from 'lucide-react'

const VarianceReport = () => {
  const [variances, setVariances] = useState([])
  const [loading, setLoading] = useState(true)
  const [threshold, setThreshold] = useState(50)

  useEffect(() => {
    fetchVariances()
  }, [threshold])

  const fetchVariances = async () => {
    setLoading(true)
    try {
      const response = await dailyRecordsAPI.getVarianceReport({ threshold })
      setVariances(response.data)
    } catch (error) {
      console.error('Error fetching variances:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Variance Report</h3>
              <p className="text-sm text-white/80">Records with significant differences requiring attention</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
            <Filter className="w-4 h-4" />
            <label className="text-sm font-medium">Threshold:</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-20 px-3 py-1.5 text-sm bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-white/50 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Variances List */}
      {variances.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {variances.map((record) => (
            <div 
              key={record.id} 
              className="bg-white rounded-2xl shadow-soft border-2 border-red-200 p-6 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between">
                {/* Date Section */}
                <div className="flex items-center gap-6">
                  <div className="text-center bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-lg">
                    <div className="text-3xl font-bold">{new Date(record.date).getDate()}</div>
                    <div className="text-xs uppercase tracking-wide">{new Date(record.date).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">{record.day}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="text-sm text-gray-600">{record.notes || 'No additional notes'}</div>
                  </div>
                </div>

                {/* Metrics Section */}
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Sales</div>
                    <div className="text-xl font-bold text-gray-900">₹{(record.total_sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Recorded</div>
                    <div className="text-xl font-bold text-gray-900">₹{(record.recorded_sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                  </div>
                  
                  <div className="text-right bg-gradient-to-br from-red-50 to-red-100 px-6 py-4 rounded-xl border-2 border-red-300">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {record.difference > 0 ? (
                        <TrendingUp className="w-5 h-5 text-red-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-2xl font-bold text-red-700">
                        ₹{Math.abs(record.difference || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-xs text-red-600 uppercase tracking-wide font-semibold">Difference</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-primary-100 p-12 text-center">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-green-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">All Clear!</div>
          <div className="text-gray-500">No high variances found above the threshold of ₹{threshold}</div>
        </div>
      )}
    </div>
  )
}

export default VarianceReport
