import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AIInsightsCharts({ discrepancyData, expiryData, valueData, auditData, movementData, adjustmentData }) {
  if (!discrepancyData || !expiryData || !valueData || !auditData || !movementData || !adjustmentData) {
    return null
  }

  const discrepancyChartData = [
    { name: 'Positive', value: discrepancyData.positive_discrepancies || 0, fill: '#00C49F' },
    { name: 'Negative', value: discrepancyData.negative_discrepancies || 0, fill: '#FF8042' }
  ]

  const expiryChartData = (expiryData.categories || []).map(cat => ({
    category: cat.name,
    count: cat.count,
    fill: cat.name === 'Expired' ? '#FF0000' :
          cat.name === '0-30 Days' ? '#FF8042' :
          cat.name === '31-60 Days' ? '#FFBB28' :
          cat.name === '61-90 Days' ? '#00C49F' : '#0088FE'
  }))

  const valueChartData = (valueData.distribution || []).map(item => ({
    range: item.range,
    count: item.count
  }))

  const movementChartData = [
    { type: 'Purchases', quantity: movementData.purchases_30_days || 0, fill: '#00C49F' },
    { type: 'Sales', quantity: movementData.sales_30_days || 0, fill: '#FF8042' }
  ]

  const adjustmentChartData = (adjustmentData.by_type || []).map(item => ({
    type: item.type?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN',
    count: item.count
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Discrepancy Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={discrepancyChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {discrepancyChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Expiry Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expiryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8">
              {expiryChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Stock Value Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={valueChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="range" type="category" width={100} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Audit Performance (30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          {auditData.daily_audits && auditData.daily_audits.length > 0 ? (
            <LineChart data={auditData.daily_audits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="audits" stroke="#8884d8" />
            </LineChart>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No audit data available
            </div>
          )}
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Stock Movement</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={movementChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity">
              {movementChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Adjustments by Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={adjustmentChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="type" type="category" width={120} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
