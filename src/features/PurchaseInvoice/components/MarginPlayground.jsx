import React, { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Package, Calculator, Filter, RefreshCw, Percent, TrendingDown, BarChart3, PieChart as PieChartIcon, Search, Play } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import toast from 'react-hot-toast'
import { purchaseInvoiceAPI } from '../services/api'
import ProductAutocomplete from './ProductAutocomplete'

const MarginPlayground = ({ selectedShop }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState({
    product_name: '',
    composition: '',
    manufacturer: '',
    margin_min: '',
    margin_max: '',
    date_from: '',
    date_to: ''
  })
  const [simulation, setSimulation] = useState({
    selected_products: [],
    selected_compositions: [],
    new_margin: 35,
    apply_discount: ''
  })
  const [simulationResult, setSimulationResult] = useState(null)

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

  useEffect(() => {
    fetchPlaygroundData()
  }, [selectedShop])

  const fetchPlaygroundData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedShop) params.shop_id = selectedShop
      if (filters.product_name) params.product_name = filters.product_name
      if (filters.composition) params.composition = filters.composition
      if (filters.manufacturer) params.manufacturer = filters.manufacturer
      if (filters.margin_min) params.margin_min = parseFloat(filters.margin_min)
      if (filters.margin_max) params.margin_max = parseFloat(filters.margin_max)
      if (filters.date_from) params.date_from = filters.date_from
      if (filters.date_to) params.date_to = filters.date_to

      const response = await purchaseInvoiceAPI.getMarginPlayground(params)
      setData(response.data)
    } catch (error) {
      console.error('Playground error:', error)
      toast.error('Failed to fetch playground data')
    } finally {
      setLoading(false)
    }
  }

  const runSimulation = async () => {
    if (!simulation.new_margin) {
      toast.error('Please enter new margin percentage')
      return
    }

    try {
      const payload = {
        new_margin: parseFloat(simulation.new_margin),
        product_names: simulation.selected_products.length > 0 ? simulation.selected_products : null,
        compositions: simulation.selected_compositions.length > 0 ? simulation.selected_compositions : null,
        apply_discount: simulation.apply_discount ? parseFloat(simulation.apply_discount) : null
      }

      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await purchaseInvoiceAPI.simulateMarginChange(payload, params)
      setSimulationResult(response.data)
      toast.success('Simulation completed')
    } catch (error) {
      console.error('Simulation error:', error)
      toast.error('Failed to run simulation')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      product_name: '',
      composition: '',
      manufacturer: '',
      margin_min: '',
      margin_max: '',
      date_from: '',
      date_to: ''
    })
    setTimeout(fetchPlaygroundData, 100)
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <ProductAutocomplete
              value={filters.product_name}
              onChange={(value) => handleFilterChange('product_name', value)}
              placeholder="Search product"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Composition</label>
            <input
              type="text"
              value={filters.composition}
              onChange={(e) => handleFilterChange('composition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Search composition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
            <input
              type="text"
              value={filters.manufacturer}
              onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Search manufacturer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Margin Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.margin_min}
                onChange={(e) => handleFilterChange('margin_min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Min %"
              />
              <input
                type="number"
                value={filters.margin_max}
                onChange={(e) => handleFilterChange('margin_max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Max %"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={fetchPlaygroundData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <Percent className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-sm opacity-90">Avg Margin</p>
            <p className="text-3xl font-bold">{data.summary.avg_margin.toFixed(1)}%</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <DollarSign className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-sm opacity-90">Total Revenue</p>
            <p className="text-3xl font-bold">₹{(data.summary.total_revenue / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <DollarSign className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-sm opacity-90">Total Profit</p>
            <p className="text-3xl font-bold">₹{(data.summary.total_profit / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 opacity-80" />
              <BarChart3 className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-sm opacity-90">Total Items</p>
            <p className="text-3xl font-bold">{data.summary.total_items}</p>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin Distribution */}
        {data?.margin_distribution && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Margin Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.margin_distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Composition Breakdown */}
        {data?.composition_breakdown && data.composition_breakdown.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Compositions by Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.composition_breakdown.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  label={({ composition, percent }) => `${composition.substring(0, 15)}... (${(percent * 100).toFixed(0)}%)`}
                >
                  {data.composition_breakdown.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Margin Simulation */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Margin Simulation Playground</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Margin %</label>
            <input
              type="number"
              value={simulation.new_margin}
              onChange={(e) => setSimulation(prev => ({ ...prev, new_margin: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="35"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount % (Optional)</label>
            <input
              type="number"
              value={simulation.apply_discount}
              onChange={(e) => setSimulation(prev => ({ ...prev, apply_discount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={runSimulation}
              className="w-full px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Run Simulation
            </button>
          </div>
        </div>

        {simulationResult && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                <p className="text-sm text-gray-600">Revenue Change</p>
                <p className={`text-2xl font-bold ${simulationResult.summary.total_revenue_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {simulationResult.summary.total_revenue_change >= 0 ? '+' : ''}₹{simulationResult.summary.total_revenue_change.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <p className="text-sm text-gray-600">Profit Change</p>
                <p className={`text-2xl font-bold ${simulationResult.summary.total_profit_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {simulationResult.summary.total_profit_change >= 0 ? '+' : ''}₹{simulationResult.summary.total_profit_change.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <p className="text-sm text-gray-600">Avg New Margin</p>
                <p className="text-2xl font-bold text-purple-600">{simulationResult.summary.avg_new_margin.toFixed(1)}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <p className="text-sm text-gray-600">MRP Capped Items</p>
                <p className="text-2xl font-bold text-orange-600">{simulationResult.summary.items_capped_by_mrp}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
              <h4 className="font-semibold text-gray-800 mb-3">Simulation Results ({simulationResult.items.length} items)</h4>
              <div className="space-y-2">
                {simulationResult.items.slice(0, 20).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{item.product_name}</p>
                      <p className="text-xs text-gray-600">{item.composition}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-right">
                        <p className="text-gray-500">Current</p>
                        <p className="font-semibold">₹{item.current_selling_price} ({item.current_margin.toFixed(1)}%)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500">New</p>
                        <p className="font-semibold text-blue-600">₹{item.new_selling_price} ({item.new_margin.toFixed(1)}%)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500">Impact</p>
                        <p className={`font-semibold ${item.profit_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.profit_change >= 0 ? '+' : ''}₹{item.profit_change.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composition Breakdown Table */}
        {data?.composition_breakdown && data.composition_breakdown.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Composition Analysis</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.composition_breakdown.map((comp, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800 text-sm">{comp.composition}</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                      {comp.avg_margin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <p className="font-semibold text-green-600">₹{comp.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Profit</p>
                      <p className="font-semibold text-purple-600">₹{comp.profit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Items</p>
                      <p className="font-semibold text-gray-700">{comp.items}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Breakdown Table */}
        {data?.product_breakdown && data.product_breakdown.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products Analysis</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.product_breakdown.map((prod, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{prod.product_name}</p>
                      <p className="text-xs text-gray-600">{prod.composition}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                      {prod.avg_margin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <p className="font-semibold text-green-600">₹{prod.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Profit</p>
                      <p className="font-semibold text-purple-600">₹{prod.profit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Qty</p>
                      <p className="font-semibold text-gray-700">{prod.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manufacturer Breakdown */}
      {data?.manufacturer_breakdown && data.manufacturer_breakdown.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Manufacturer Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.manufacturer_breakdown.map((mfr, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800">{mfr.manufacturer}</p>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-semibold">
                    {mfr.avg_margin.toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Revenue</p>
                    <p className="font-semibold text-green-600">₹{(mfr.revenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Profit</p>
                    <p className="font-semibold text-purple-600">₹{(mfr.profit / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Items</p>
                    <p className="font-semibold text-gray-700">{mfr.items}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MarginPlayground
