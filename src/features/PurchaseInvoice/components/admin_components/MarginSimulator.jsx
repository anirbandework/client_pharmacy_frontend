import { useState, useEffect } from 'react'
import {
  TrendingUp, Calculator, IndianRupee, Package, Store, Search,
  Plus, Trash2, BarChart3, PieChart as PieChartIcon, RefreshCw,
  AlertCircle, CheckCircle, ArrowUpCircle, ArrowDownCircle, Zap
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import toast from 'react-hot-toast'
import { adminPurchaseInvoiceAPI } from '../../services/admin_purchase_invoice_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'
import ProductAutocomplete from '../shared/ProductAutocomplete'
import CompositionAutocomplete from '../shared/CompositionAutocomplete'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

const MarginSimulator = () => {
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [searchProduct, setSearchProduct] = useState('')
  const [searchComposition, setSearchComposition] = useState('')
  const [marginAdjustment, setMarginAdjustment] = useState(0)
  const [adjustmentType, setAdjustmentType] = useState('increase') // increase or decrease
  const [simulationResult, setSimulationResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [availableProducts, setAvailableProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch (error) {
      toast.error('Failed to fetch shops')
    }
  }

  const loadAvailableProducts = async () => {
    if (!searchProduct && !searchComposition) {
      toast.error('Enter product name or composition to search')
      return
    }

    setLoadingProducts(true)
    try {
      const params = {
        shop_id: selectedShop || undefined,
        product_name: searchProduct || undefined,
        composition: searchComposition || undefined
      }
      const response = await adminPurchaseInvoiceAPI.getMarginPlayground(params)
      
      if (response.data.top_products && response.data.top_products.length > 0) {
        setAvailableProducts(response.data.top_products)
        toast.success(`Found ${response.data.top_products.length} products`)
      } else {
        setAvailableProducts([])
        toast.error('No products found matching your search')
      }
    } catch (error) {
      toast.error('Failed to load products')
      setAvailableProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  const addItemToSelection = (product) => {
    const exists = selectedItems.find(
      item => item.product_name === product.product_name && item.composition === product.composition
    )
    
    if (exists) {
      toast.error('Item already added')
      return
    }

    setSelectedItems([...selectedItems, {
      product_name: product.product_name,
      composition: product.composition,
      current_margin: product.avg_purchase_margin,
      purchase_value: product.purchase_value,
      quantity: product.quantity
    }])
    toast.success('Item added to selection')
  }

  const removeItemFromSelection = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const runSimulation = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one product')
      return
    }

    if (marginAdjustment === 0) {
      toast.error('Please enter margin adjustment value')
      return
    }

    setLoading(true)
    try {
      const productNames = selectedItems.map(item => item.product_name).filter(p => p)
      const compositions = selectedItems.map(item => item.composition).filter(c => c)

      // Calculate new margin based on adjustment type
      const currentMaxMargin = Math.max(...selectedItems.map(i => i.current_margin))
      const newMargin = adjustmentType === 'increase' 
        ? currentMaxMargin + marginAdjustment
        : currentMaxMargin - marginAdjustment

      console.log('Simulation request:', {
        product_names: productNames,
        compositions: compositions,
        new_margin: newMargin,
        shop_id: selectedShop
      })

      const requestData = {
        product_names: productNames.length > 0 ? productNames : undefined,
        compositions: compositions.length > 0 ? compositions : undefined,
        new_margin: newMargin
      }

      const params = selectedShop ? { shop_id: selectedShop } : {}

      const response = await adminPurchaseInvoiceAPI.simulateMarginChange(requestData, params)

      console.log('Simulation response:', response)

      if (response && response.data) {
        setSimulationResult(response.data)
        toast.success('Simulation completed!')
      } else {
        toast.error('No simulation data received')
      }
    } catch (error) {
      console.error('Simulation error:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Simulation failed'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const clearSimulation = () => {
    setSimulationResult(null)
    setSelectedItems([])
    setMarginAdjustment(0)
    setSearchProduct('')
    setSearchComposition('')
    setAvailableProducts([])
  }

  // Prepare chart data
  const getRevenueComparisonData = () => {
    if (!simulationResult) return []
    
    return [
      {
        name: 'Current',
        Revenue: simulationResult.summary.total_revenue_change > 0 
          ? simulationResult.items.reduce((sum, item) => sum + item.old_revenue, 0)
          : 0,
        Profit: simulationResult.items.reduce((sum, item) => sum + item.old_profit, 0)
      },
      {
        name: 'Projected',
        Revenue: simulationResult.items.reduce((sum, item) => sum + item.new_revenue, 0),
        Profit: simulationResult.items.reduce((sum, item) => sum + item.new_profit, 0)
      }
    ]
  }

  const getMarginDistributionData = () => {
    if (!simulationResult) return []
    
    const ranges = [
      { range: '0-10%', count: 0 },
      { range: '10-20%', count: 0 },
      { range: '20-30%', count: 0 },
      { range: '30-40%', count: 0 },
      { range: '40%+', count: 0 }
    ]

    simulationResult.items.forEach(item => {
      const margin = item.new_margin
      if (margin < 10) ranges[0].count++
      else if (margin < 20) ranges[1].count++
      else if (margin < 30) ranges[2].count++
      else if (margin < 40) ranges[3].count++
      else ranges[4].count++
    })

    return ranges
  }

  const getTopImpactProducts = () => {
    if (!simulationResult) return []
    
    return [...simulationResult.items]
      .sort((a, b) => Math.abs(b.profit_change) - Math.abs(a.profit_change))
      .slice(0, 10)
  }

  return (
    <div className="space-y-6">
      {/* Shop Filter */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
            className="flex-1 max-w-xs px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          >
            <option value="">All Shops</option>
            {shops.map(shop => (
              <option key={shop.id} value={shop.id}>{shop.shop_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Selection */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Margin Adjustment Simulator</h2>
        </div>

        {/* Search Products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 block">Product Name</label>
            <ProductAutocomplete
              value={searchProduct}
              onChange={setSearchProduct}
              placeholder="Search product..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 block">Composition</label>
            <CompositionAutocomplete
              value={searchComposition}
              onChange={setSearchComposition}
              placeholder="Search composition..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadAvailableProducts}
              disabled={loadingProducts}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loadingProducts ? 'Searching...' : 'Search Products'}
            </button>
          </div>
        </div>

        {/* Available Products */}
        {availableProducts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Available Products (Click to add)</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {availableProducts.map((product, idx) => (
                <div
                  key={idx}
                  onClick={() => addItemToSelection(product)}
                  className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-200 dark:border-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">{product.product_name}</p>
                      {product.composition && (
                        <p className="text-xs text-gray-500 dark:text-slate-500">{product.composition}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        ₹{product.purchase_value.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">
                        {product.avg_purchase_margin.toFixed(1)}% margin
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Selected Items ({selectedItems.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/40">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">{item.product_name}</p>
                    {item.composition && (
                      <p className="text-xs text-gray-500 dark:text-slate-500">{item.composition}</p>
                    )}
                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                      Current Margin: {item.current_margin.toFixed(1)}% | Qty: {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItemFromSelection(idx)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Margin Adjustment Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 block">Adjustment Type</label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
            >
              <option value="increase">Increase Margin</option>
              <option value="decrease">Decrease Margin</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 block">
              Margin Adjustment (%)
            </label>
            <input
              type="number"
              value={marginAdjustment}
              onChange={(e) => setMarginAdjustment(parseFloat(e.target.value) || 0)}
              placeholder="e.g., 5"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              step="0.1"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={runSimulation}
              disabled={loading || selectedItems.length === 0}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
              {loading ? 'Simulating...' : 'Run Simulation'}
            </button>
            {simulationResult && (
              <button
                onClick={clearSimulation}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>How it works:</strong> Select products, set margin adjustment, and run simulation. 
              The system will calculate new selling prices (capped at MRP), projected revenue, and profit changes.
            </p>
            {loading && (
              <p className="text-xs text-blue-600 mt-2 font-semibold animate-pulse flex items-center gap-1">
                <Zap className="w-3 h-3" /> Running simulation... Please wait
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Simulation Results */}
      {simulationResult && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 opacity-80" />
                <ArrowUpCircle className="w-5 h-5" />
              </div>
              <p className="text-sm opacity-90">Total Items</p>
              <p className="text-2xl font-bold">{simulationResult.summary.total_items}</p>
              <p className="text-xs opacity-75 mt-1">
                {simulationResult.summary.items_capped_by_mrp} capped by MRP
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <IndianRupee className="w-8 h-8 opacity-80" />
                {simulationResult.summary.total_revenue_change >= 0 ? (
                  <ArrowUpCircle className="w-5 h-5" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5" />
                )}
              </div>
              <p className="text-sm opacity-90">Revenue Change</p>
              <p className="text-2xl font-bold">
                {simulationResult.summary.total_revenue_change >= 0 ? '+' : ''}
                ₹{Math.abs(simulationResult.summary.total_revenue_change).toLocaleString()}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {((simulationResult.summary.total_revenue_change / 
                  simulationResult.items.reduce((sum, i) => sum + i.old_revenue, 0)) * 100).toFixed(1)}% change
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-80" />
                {simulationResult.summary.total_profit_change >= 0 ? (
                  <ArrowUpCircle className="w-5 h-5" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5" />
                )}
              </div>
              <p className="text-sm opacity-90">Profit Change</p>
              <p className="text-2xl font-bold">
                {simulationResult.summary.total_profit_change >= 0 ? '+' : ''}
                ₹{Math.abs(simulationResult.summary.total_profit_change).toLocaleString()}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {((simulationResult.summary.total_profit_change / 
                  simulationResult.items.reduce((sum, i) => sum + i.old_profit, 0)) * 100).toFixed(1)}% change
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-8 h-8 opacity-80" />
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-sm opacity-90">Avg New Margin</p>
              <p className="text-2xl font-bold">
                {simulationResult.summary.avg_new_margin.toFixed(1)}%
              </p>
              <p className="text-xs opacity-75 mt-1">
                Target margin achieved
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue & Profit Comparison */}
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Revenue & Profit Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getRevenueComparisonData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Profit" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Margin Distribution */}
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
                New Margin Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getMarginDistributionData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, count }) => count > 0 ? `${range}: ${count}` : ''}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {getMarginDistributionData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Impact Products */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Top 10 Products by Profit Impact
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-2 text-left dark:text-slate-300">Product</th>
                    <th className="px-4 py-2 text-right dark:text-slate-300">Current Price</th>
                    <th className="px-4 py-2 text-right dark:text-slate-300">New Price</th>
                    <th className="px-4 py-2 text-right dark:text-slate-300">Current Margin</th>
                    <th className="px-4 py-2 text-right dark:text-slate-300">New Margin</th>
                    <th className="px-4 py-2 text-right dark:text-slate-300">Profit Change</th>
                    <th className="px-4 py-2 text-center dark:text-slate-300">MRP Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getTopImpactProducts().map((item, idx) => (
                    <tr key={idx} className="border-t dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 dark:text-white">{item.product_name}</p>
                        {item.composition && (
                          <p className="text-xs text-gray-500 dark:text-slate-500">{item.composition}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right dark:text-slate-300">₹{item.current_selling_price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-600">
                        ₹{item.new_selling_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right dark:text-slate-300">{item.current_margin.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">
                        {item.new_margin.toFixed(1)}%
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${
                        item.profit_change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.profit_change >= 0 ? '+' : ''}₹{item.profit_change.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.capped_by_mrp ? (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            MRP Capped
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Within MRP
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">All Simulated Products</h3>
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {simulationResult.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-200 dark:border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white">{item.product_name}</p>
                        {item.composition && (
                          <p className="text-xs text-gray-500 dark:text-slate-500">{item.composition}</p>
                        )}
                      </div>
                      {item.capped_by_mrp && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          MRP: {item.mrp}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500 dark:text-slate-500">Price Change</p>
                        <p className="font-semibold dark:text-slate-300">
                          ₹{item.current_selling_price.toFixed(2)} → ₹{item.new_selling_price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-500">Margin Change</p>
                        <p className="font-semibold dark:text-slate-300">
                          {item.current_margin.toFixed(1)}% → {item.new_margin.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-500">Revenue Impact</p>
                        <p className={`font-semibold ${item.revenue_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.revenue_change >= 0 ? '+' : ''}₹{item.revenue_change.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-500">Profit Impact</p>
                        <p className={`font-semibold ${item.profit_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.profit_change >= 0 ? '+' : ''}₹{item.profit_change.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MarginSimulator
