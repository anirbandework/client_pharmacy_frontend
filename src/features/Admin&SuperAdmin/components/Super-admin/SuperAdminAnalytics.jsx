import React, { useState, useEffect } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Building2, UserCheck, Activity, Loader2 } from 'lucide-react'
import Layout from '../../../../components/Layout'
import { superAdminApi } from '../../services/admin&superAminApi'

const SuperAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await superAdminApi.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="text-xl flex items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" />Loading analytics...</div></div>
  }

  if (!analytics) {
    return <div className="flex items-center justify-center py-20"><div className="text-xl text-red-600">Failed to load analytics</div></div>
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  const activeStatusData = [
    { name: 'Active Admins', value: analytics.active_status.admins.active },
    { name: 'Inactive Admins', value: analytics.active_status.admins.inactive },
    { name: 'Active Shops', value: analytics.active_status.shops.active },
    { name: 'Inactive Shops', value: analytics.active_status.shops.inactive },
    { name: 'Active Staff', value: analytics.active_status.staff.active },
    { name: 'Inactive Staff', value: analytics.active_status.staff.inactive }
  ]

  const recentData = [
    { name: 'Admins', count: analytics.recent_registrations.admins },
    { name: 'Shops', count: analytics.recent_registrations.shops },
    { name: 'Staff', count: analytics.recent_registrations.staff }
  ]

  return (
    <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Organizations</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.summary.total_organizations}</p>
              </div>
              <Building2 className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Admins</p>
                <p className="text-3xl font-bold text-green-600">{analytics.summary.total_admins}</p>
              </div>
              <UserCheck className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Shops</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.summary.total_shops}</p>
              </div>
              <Building2 className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Staff</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.summary.total_staff}</p>
              </div>
              <Users className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Organization Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Organization Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.org_distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="organization_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="admins" fill="#3b82f6" name="Admins" />
                <Bar dataKey="shops" fill="#10b981" name="Shops" />
                <Bar dataKey="staff" fill="#f59e0b" name="Staff" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Active vs Inactive Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Active vs Inactive Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activeStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff per Shop */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Top 10 Shops by Staff Count</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.staff_per_shop} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="shop_code" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="staff_count" fill="#8b5cf6" name="Staff Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Recent Registrations (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={3} name="New Registrations" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Stats Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Organization Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Organization ID</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Admins</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Shops</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Staff</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Total Users</th>
                </tr>
              </thead>
              <tbody>
                {analytics.org_distribution.map((org, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{org.organization_id}</td>
                    <td className="px-4 py-3 text-right">{org.admins}</td>
                    <td className="px-4 py-3 text-right">{org.shops}</td>
                    <td className="px-4 py-3 text-right">{org.staff}</td>
                    <td className="px-4 py-3 text-right font-semibold">{org.admins + org.shops + org.staff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

export default SuperAdminAnalytics
