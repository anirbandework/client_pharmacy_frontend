import React, { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Package, Calculator, Filter, RefreshCw, Percent, TrendingDown, BarChart3, PieChart as PieChartIcon, Search, Play, Target, Lightbulb, Calendar, Info, X, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import toast from 'react-hot-toast'
import { purchaseInvoiceAPI } from '../services/api'
import ProductAutocomplete from './ProductAutocomplete'
import CompositionAutocomplete from './CompositionAutocomplete'

const MarginPlayground = ({ selectedShop }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [pricingOptimization, setPricingOptimization] = useState(null)
  const [marginTrends, setMarginTrends] = useState(null)
  const [targetMargin, setTargetMargin] = useState(35)
  const [showGuide, setShowGuide] = useState(false)
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
    fetchPricingOptimization()
    fetchMarginTrends()
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

  const fetchPricingOptimization = async () => {
    try {
      const params = { target_margin: targetMargin }
      if (selectedShop) params.shop_id = selectedShop
      const response = await purchaseInvoiceAPI.getPricingOptimization(params)
      setPricingOptimization(response.data)
    } catch (error) {
      console.error('Pricing optimization error:', error)
    }
  }

  const fetchMarginTrends = async () => {
    try {
      const params = {}
      if (selectedShop) params.shop_id = selectedShop
      const response = await purchaseInvoiceAPI.getMarginTrends(params)
      setMarginTrends(response.data)
    } catch (error) {
      console.error('Margin trends error:', error)
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
      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Info className="w-6 h-6" />
                Margin Playground Guide
              </h2>
              <button onClick={() => setShowGuide(false)} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Overview */}
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  What is Margin Playground?
                </h3>
                <p className="text-gray-600 leading-relaxed">A powerful analytics tool to analyze and optimize your profit margins across all products. Make data-driven pricing decisions to maximize profitability.</p>
              </div>

              {/* Step 1 */}
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-green-600" />
                  Step 1: Filter Your Data
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">Product/Composition/Manufacturer:</span> Filter by specific products or categories</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">Margin Range:</span> Find products with margins between min-max % (e.g., 20-40%)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">Date Range:</span> Analyze specific time periods</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p>Click <span className="font-semibold text-gray-800">"Apply Filters"</span> to refresh data</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Step 2: Understand Key Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="font-semibold text-purple-800">Avg Margin</p>
                    <p className="text-sm text-purple-600">Average profit margin across all products</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="font-semibold text-purple-800">Total Revenue</p>
                    <p className="text-sm text-purple-600">Total sales value (Selling Price × Quantity)</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="font-semibold text-purple-800">Total Profit</p>
                    <p className="text-sm text-purple-600">Total profit earned (Revenue - Cost)</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="font-semibold text-purple-800">ROI %</p>
                    <p className="text-sm text-purple-600">Return on Investment = (Profit / Cost) × 100</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="font-semibold text-purple-800">Low Margin Items</p>
                    <p className="text-sm text-purple-600">Products with margin below 20% (needs attention)</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-orange-600" />
                  Step 3: Analyze Charts & Breakdowns
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">Margin Distribution:</span> See how many products fall in each margin range</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">Margin Trends:</span> Track margin changes over months</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">Composition/Product Analysis:</span> Identify top performers by revenue & profit</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">Manufacturer Performance:</span> Compare margins across suppliers</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  Step 4: Pricing Optimization
                </h3>
                <p className="text-gray-600 mb-3">System automatically identifies products below target margin and suggests optimal prices:</p>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">High Priority:</span> Products with biggest profit improvement potential</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">Current vs Optimal:</span> Compare current price with recommended price</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">Profit Impact:</span> Expected profit increase per product</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <p><span className="font-semibold text-gray-800">MRP Constraints:</span> System ensures prices don't exceed MRP</p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  Step 5: Run Simulations
                </h3>
                <p className="text-gray-600 mb-3">Test "what-if" scenarios before changing actual prices:</p>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <p>Enter <span className="font-semibold text-gray-800">New Margin %</span> (e.g., 35% for 35% profit)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <p>Optionally add <span className="font-semibold text-gray-800">Discount %</span> to simulate promotional pricing</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <p>Click <span className="font-semibold text-gray-800">"Run Simulation"</span> to see impact on all products</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <p>Review revenue change, profit change, and MRP-capped items</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <p>Use insights to make informed pricing decisions</p>
                  </div>
                </div>
              </div>

              {/* Formula */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 shadow-lg text-white">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Key Formula
                </h3>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <p className="font-mono text-lg mb-2">Profit Margin % = ((Selling Price - Unit Price) / Unit Price) × 100</p>
                  <p className="text-sm opacity-90">Example: If Unit Price = ₹100 and Selling Price = ₹135, Margin = 35%</p>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 shadow-md border-2 border-red-200">
                <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Notes
                </h3>
                <div className="space-y-2 text-red-700">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p>Only <span className="font-semibold">admin-verified invoices</span> are included in analysis</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p>Negative margins indicate selling below cost (loss-making)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p>Simulations are for planning only - they don't change actual prices</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p>Always check MRP constraints before implementing price changes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">How to Use</span>
          </button>
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
            <CompositionAutocomplete
              value={filters.composition}
              onChange={(value) => handleFilterChange('composition', value)}
              placeholder="Search composition"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <Percent className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-sm opacity-90">Avg Margin</p>
            <p className="text-3xl font-bold">{data.summary.avg_margin.toFixed(1)}%</p>
            {data.summary.median_margin && (
              <p className="text-xs opacity-75 mt-1">Median: {data.summary.median_margin.toFixed(1)}%</p>
            )}
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <DollarSign className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-sm opacity-90">Total Revenue</p>
            <p className="text-3xl font-bold">₹{(data.summary.total_revenue / 1000).toFixed(0)}K</p>
            {data.summary.roi_percentage && (
              <p className="text-xs opacity-75 mt-1">ROI: {data.summary.roi_percentage.toFixed(1)}%</p>
            )}
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <DollarSign className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-sm opacity-90">Total Profit</p>
            <p className="text-3xl font-bold">₹{(data.summary.total_profit / 1000).toFixed(0)}K</p>
            {data.summary.margin_efficiency_score && (
              <p className="text-xs opacity-75 mt-1">Efficiency: {data.summary.margin_efficiency_score.toFixed(1)}%</p>
            )}
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 opacity-80" />
              <BarChart3 className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-sm opacity-90">Total Items</p>
            <p className="text-3xl font-bold">{data.summary.total_items}</p>
            {data.summary.margin_std_dev && (
              <p className="text-xs opacity-75 mt-1">Std Dev: {data.summary.margin_std_dev.toFixed(1)}%</p>
            )}
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
              <Target className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-sm opacity-90">Low Margin Items</p>
            <p className="text-3xl font-bold">{data.summary.low_margin_count || 0}</p>
            {data.summary.low_margin_revenue && (
              <p className="text-xs opacity-75 mt-1">₹{(data.summary.low_margin_revenue / 1000).toFixed(0)}K revenue</p>
            )}
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin Trends */}
        {marginTrends?.trends && marginTrends.trends.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Margin Trends</h3>
              </div>
              {marginTrends.trend_direction && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  marginTrends.trend_direction === 'improving' ? 'bg-green-100 text-green-700' :
                  marginTrends.trend_direction === 'declining' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {marginTrends.trend_direction}
                </span>
              )}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marginTrends.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="avg_margin" stroke="#3b82f6" name="Avg Margin %" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#10b981" name="Profit (₹)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

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
      </div>

      {/* Pricing Optimization */}
      {pricingOptimization?.opportunities && pricingOptimization.opportunities.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-800">Pricing Optimization Opportunities</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <p className="text-sm text-gray-600">Products Below Target</p>
              <p className="text-2xl font-bold text-amber-600">{pricingOptimization.summary.products_below_target}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-gray-600">Potential Revenue Increase</p>
              <p className="text-2xl font-bold text-green-600">₹{(pricingOptimization.summary.potential_revenue_increase / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-gray-600">Potential Profit Increase</p>
              <p className="text-2xl font-bold text-blue-600">₹{(pricingOptimization.summary.potential_profit_increase / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
              <p className="text-sm text-gray-600">Target Margin</p>
              <p className="text-2xl font-bold text-purple-600">{pricingOptimization.summary.target_margin}%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
            <h4 className="font-semibold text-gray-800 mb-3">Top Opportunities (Showing {Math.min(20, pricingOptimization.opportunities.length)} of {pricingOptimization.opportunities.length})</h4>
            <div className="space-y-2">
              {pricingOptimization.opportunities.slice(0, 20).map((opp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 text-sm">{opp.product_name}</p>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        opp.priority === 'high' ? 'bg-red-100 text-red-700' :
                        opp.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {opp.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{opp.composition}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-right">
                      <p className="text-gray-500 text-xs">Current</p>
                      <p className="font-semibold">₹{opp.current_selling_price} ({opp.current_margin.toFixed(1)}%)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs">Optimal</p>
                      <p className="font-semibold text-green-600">₹{opp.optimal_selling_price} ({opp.optimal_margin.toFixed(1)}%)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs">Profit Impact</p>
                      <p className="font-semibold text-blue-600">+₹{opp.profit_impact.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
