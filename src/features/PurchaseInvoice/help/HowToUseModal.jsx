import { useState } from 'react'
import { X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'

// Admin help content
import AdminHelpDashboard from './admin/HelpDashboard'
import AdminHelpVerification from './admin/HelpVerification'
import AdminHelpExpiryAlerts from './admin/HelpExpiryAlerts'
import AdminHelpSuppliers from './admin/HelpSuppliers'
import AdminHelpMarginPlayground from './admin/HelpMarginPlayground'
import AdminHelpMarginSimulator from './admin/HelpMarginSimulator'
import AdminHelpAIInsights from './admin/HelpAIInsights'

// Staff help content
import StaffHelpInvoiceList from './staff/HelpInvoiceList'
import StaffHelpUploadInvoice from './staff/HelpUploadInvoice'
import StaffHelpExpiryAlerts from './staff/HelpExpiryAlerts'
import StaffHelpSuppliers from './staff/HelpSuppliers'
import StaffHelpDashboard from './staff/HelpDashboard'

const HELP_MAP = {
  admin: {
    dashboard: AdminHelpDashboard,
    verification: AdminHelpVerification,
    'expiry-alerts': AdminHelpExpiryAlerts,
    suppliers: AdminHelpSuppliers,
    margins: AdminHelpMarginPlayground,
    simulator: AdminHelpMarginSimulator,
    'ai-insights': AdminHelpAIInsights,
  },
  staff: {
    list: StaffHelpInvoiceList,
    upload: StaffHelpUploadInvoice,
    'expiry-alerts': StaffHelpExpiryAlerts,
    suppliers: StaffHelpSuppliers,
    dashboard: StaffHelpDashboard,
  },
}

const Section = ({ heading, points }) => {
  const [open, setOpen] = useState(true)
  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="font-semibold text-slate-700 text-sm">{heading}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <ul className="px-4 py-3 space-y-2">
          {points.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const HowToUseModal = ({ role, activeTab, onClose }) => {
  const helpFn = HELP_MAP[role]?.[activeTab]
  if (!helpFn) return null
  const help = helpFn()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{help.icon}</span>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-0.5">How to Use</p>
              <h2 className="text-white font-bold text-xl">{help.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <div className="px-5 py-3 border-b border-slate-100 flex-shrink-0">
          <p className="text-slate-500 text-sm">{help.description}</p>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {help.sections.map((section, i) => (
            <Section key={i} heading={section.heading} points={section.points} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default HowToUseModal
