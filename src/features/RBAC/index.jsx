import React from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../components/Layout'
import OrganizationPermissions from './components/OrganizationPermissions'
import { Shield } from 'lucide-react'

const RBAC = () => {
  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">RBAC Management</h1>
              <p className="text-white/90 text-xs md:text-sm">Configure module permissions per organization</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          <OrganizationPermissions />
        </div>
      </div>
    </Layout>
  )
}

export default RBAC
