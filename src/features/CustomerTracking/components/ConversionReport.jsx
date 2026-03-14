import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { TrendingUp, Users, IndianRupee, Target } from 'lucide-react'

const ConversionReport = () => {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  })

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const params = {}
      if (dateRange.start_date) params.start_date = dateRange.start_date
      if (dateRange.end_date) params.end_date = dateRange.end_date
      
      const { data } = await customerTrackingAPI.getConversionReport(params)
      setReport(data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-4">
      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Date Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={dateRange.start_date}
            onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={dateRange.end_date}
            onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          />
          <button
            onClick={fetchReport}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold">{report.total_contacts}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Converted</p>
                  <p className="text-2xl font-bold text-green-600">{report.converted}</p>
                  <p className="text-xs text-gray-500">{report.conversion_rate.toFixed(1)}% rate</p>
                </div>
                <Target className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">₹{report.total_conversion_value.toFixed(2)}</p>
                </div>
                <IndianRupee className="w-10 h-10 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Value</p>
                  <p className="text-2xl font-bold text-orange-600">₹{report.avg_conversion_value.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Status Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">{report.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{report.contacted}</p>
                <p className="text-sm text-gray-600">Contacted</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{report.yellow}</p>
                <p className="text-sm text-gray-600">Yellow</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{report.converted}</p>
                <p className="text-sm text-gray-600">Converted</p>
              </div>
            </div>
          </div>

          {/* Conversion Rate Visual */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Conversion Rate</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    {report.conversion_rate.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${report.conversion_rate}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ConversionReport
