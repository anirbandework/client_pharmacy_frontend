import React from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../components/Layout'
import AdminAnalytics from './components/AdminAnalytics'
import { BarChart3, TrendingUp } from 'lucide-react'

const AdminBillingAnalytics = () => {
  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:block bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Billing Analytics</h1>
                <p className="text-white/90 text-xs md:text-sm">Revenue insights, expenses & AI-powered recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Admin Only</span>
            </div>
          </div>
        </div>

        <div className="animate-fade-in">
          <AdminAnalytics />
        </div>
      </div>
    </Layout>
  )
}

export default AdminBillingAnalytics
