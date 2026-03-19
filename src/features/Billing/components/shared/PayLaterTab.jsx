import React, { useState, useEffect, useMemo } from 'react'
import { billingAPI } from '../../services/staff_billing_apis'
import { billingAdminAPI } from '../../services/admin_billing_apis'
import { useTheme } from '../../../../contexts/ThemeContext'
import { t } from '../../../../theme'
import {
  User, Phone, ChevronDown, ChevronUp,
  CreditCard, Banknote, Wifi, CheckCircle,
  Loader2, RefreshCw, Search, Calendar, Filter, SortAsc, X,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Date helpers ─────────────────────────────────────────────────────────────
const toISO = (d) => d.toISOString().split('T')[0]

const getPeriodDates = (preset) => {
  const today = new Date()
  switch (preset) {
    case 'this_month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      return { from: toISO(start), to: toISO(today) }
    }
    case 'last_month': {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const end = new Date(today.getFullYear(), today.getMonth(), 0)
      return { from: toISO(start), to: toISO(end) }
    }
    case 'last_3_months': {
      const start = new Date(today.getFullYear(), today.getMonth() - 2, 1)
      return { from: toISO(start), to: toISO(today) }
    }
    case 'all_time':
    default:
      return { from: '', to: '' }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const PayLaterTab = ({ isAdmin = false, selectedShop = null }) => {
  const { isDark } = useTheme()

  // ── Data state ──
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedPhone, setExpandedPhone] = useState(null)

  // ── Filter state ──
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState('all_time')          // preset
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')   // all | pay_later | partial
  const [sortBy, setSortBy] = useState('highest_due')       // highest_due | lowest_due | az | oldest

  // ── Payment modal state ──
  const [paymentModal, setPaymentModal] = useState(null)
  const [paymentAmounts, setPaymentAmounts] = useState({ cash: '', card: '', online: '' })
  const [paymentReference, setPaymentReference] = useState('')
  const [paying, setPaying] = useState(false)

  // ─── Fetch ───────────────────────────────────────────────────────────────────
  useEffect(() => { fetchCustomers() }, [selectedShop, fromDate, toDate])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = {}
      if (isAdmin && selectedShop) params.shop_id = selectedShop
      if (fromDate) params.from_date = fromDate
      if (toDate) params.to_date = toDate
      const { data } = isAdmin
        ? await billingAdminAPI.getPayLaterCustomers(params)
        : await billingAPI.getPayLaterCustomers(params)
      setCustomers(data)
    } catch {
      toast.error('Failed to load Pay Later customers')
    } finally {
      setLoading(false)
    }
  }

  const applyPreset = (preset) => {
    setPeriod(preset)
    const { from, to } = getPeriodDates(preset)
    setFromDate(from)
    setToDate(to)
  }

  const handleCustomDate = (field, value) => {
    setPeriod('custom')
    if (field === 'from') setFromDate(value)
    else setToDate(value)
  }

  // ─── Client-side filtering & sorting ────────────────────────────────────────
  const displayed = useMemo(() => {
    let list = [...customers]

    // Search by name or phone
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(c =>
        (c.customer_name || '').toLowerCase().includes(q) ||
        (c.customer_phone || '').includes(q)
      )
    }

    // Status filter (based on dominant bill status)
    if (statusFilter !== 'all') {
      list = list.filter(c =>
        c.bills.some(b => b.payment_status === statusFilter)
      )
    }

    // Sort
    switch (sortBy) {
      case 'highest_due':
        list.sort((a, b) => b.total_due - a.total_due)
        break
      case 'lowest_due':
        list.sort((a, b) => a.total_due - b.total_due)
        break
      case 'az':
        list.sort((a, b) => (a.customer_name || '').localeCompare(b.customer_name || ''))
        break
      case 'oldest':
        // already sorted oldest-first from backend; reverse of default (highest_due)
        break
      default:
        break
    }

    return list
  }, [customers, search, statusFilter, sortBy])

  const totalOutstanding = customers.reduce((s, c) => s + c.total_due, 0)
  const displayedOutstanding = displayed.reduce((s, c) => s + c.total_due, 0)

  // ─── Payment modal ───────────────────────────────────────────────────────────
  const openPaymentModal = (customer) => {
    setPaymentModal({ phone: customer.customer_phone, name: customer.customer_name, totalDue: customer.total_due })
    setPaymentAmounts({ cash: '', card: '', online: '' })
    setPaymentReference('')
  }

  const totalEntered =
    (parseFloat(paymentAmounts.cash) || 0) +
    (parseFloat(paymentAmounts.card) || 0) +
    (parseFloat(paymentAmounts.online) || 0)

  const handleRecordPayment = async () => {
    if (totalEntered <= 0) { toast.error('Enter payment amount'); return }
    if (totalEntered > paymentModal.totalDue + 0.01) {
      toast.error(`Payment ₹${totalEntered.toFixed(2)} exceeds outstanding ₹${paymentModal.totalDue.toFixed(2)}`)
      return
    }
    setPaying(true)
    try {
      const payload = {
        customer_phone: paymentModal.phone,
        cash_amount: parseFloat(paymentAmounts.cash) || 0,
        card_amount: parseFloat(paymentAmounts.card) || 0,
        online_amount: parseFloat(paymentAmounts.online) || 0,
        payment_reference: paymentReference || undefined,
      }
      const adminParams = isAdmin && selectedShop ? { shop_id: selectedShop } : {}
      const { data } = isAdmin
        ? await billingAdminAPI.recordPayLaterPayment(payload, adminParams)
        : await billingAPI.recordPayLaterPayment(payload)
      toast.success(data.message)
      setPaymentModal(null)
      fetchCustomers()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to record payment')
    } finally {
      setPaying(false)
    }
  }

  // ─── Styles helpers ──────────────────────────────────────────────────────────
  const pillBase = {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '0.35rem 0.75rem',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
  }

  const activePill = {
    ...pillBase,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: '#ffffff',
    border: '1px solid transparent',
  }

  const inactivePill = (dark) => ({
    ...pillBase,
    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.06)',
    color: dark ? '#94a3b8' : '#64748b',
    border: `1px solid ${t.divider(dark)}`,
  })

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: t.text.muted(isDark) }} />
    </div>
  )

  return (
    <div className="space-y-4">

      {/* ── Summary Banner ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4"
          style={{
            background: isDark ? 'rgba(244,63,94,0.12)' : 'rgba(244,63,94,0.07)',
            border: '1px solid rgba(244,63,94,0.25)',
            transition: 'background 0.4s ease',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: isDark ? '#fb7185' : '#e11d48' }}>
            Total Outstanding
          </p>
          <p className="text-2xl font-bold" style={{ color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.4s ease' }}>
            ₹{totalOutstanding.toFixed(2)}
          </p>
          {displayed.length !== customers.length && (
            <p className="text-xs mt-1" style={{ color: t.text.muted(isDark) }}>
              Filtered: ₹{displayedOutstanding.toFixed(2)}
            </p>
          )}
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            background: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.07)',
            border: '1px solid rgba(245,158,11,0.25)',
            transition: 'background 0.4s ease',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: isDark ? '#fbbf24' : '#d97706' }}>
            Customers with Dues
          </p>
          <p className="text-2xl font-bold" style={{ color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.4s ease' }}>
            {displayed.length}
            {displayed.length !== customers.length && (
              <span className="text-sm font-normal ml-1" style={{ color: t.text.muted(isDark) }}>/ {customers.length}</span>
            )}
          </p>
        </div>

        <div className="rounded-xl p-4 flex items-center justify-end" style={t.card(isDark)}>
          <button
            onClick={fetchCustomers}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.08)',
              border: `1px solid ${t.divider(isDark)}`,
              color: t.text.secondary(isDark),
              transition: 'background 0.2s ease, border-color 0.4s ease, color 0.4s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.13)' : 'rgba(59,130,246,0.14)' }}
            onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.08)' }}
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* ── Filters Panel ── */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ ...t.card(isDark), transition: 'background 0.4s ease, border-color 0.4s ease' }}
      >
        {/* Row 1: Search + Status + Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: t.text.muted(isDark) }} />
            <input
              type="text"
              placeholder="Search by name or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg text-sm outline-none"
              style={{
                ...t.input(isDark),
                transition: 'background 0.4s ease, border-color 0.4s ease, color 0.4s ease',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ color: t.text.muted(isDark) }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" style={{ color: t.text.muted(isDark) }} />
            {[
              { id: 'all', label: 'All' },
              { id: 'pay_later', label: 'Unpaid' },
              { id: 'partial', label: 'Partial' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setStatusFilter(id)}
                style={statusFilter === id ? activePill : inactivePill(isDark)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <SortAsc className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.text.muted(isDark) }} />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="py-1.5 px-2 rounded-lg text-xs font-medium outline-none"
              style={{
                ...t.input(isDark),
                transition: 'background 0.4s ease, border-color 0.4s ease, color 0.4s ease',
              }}
            >
              <option value="highest_due">Highest Due</option>
              <option value="lowest_due">Lowest Due</option>
              <option value="az">A → Z</option>
              <option value="oldest">Oldest Bill</option>
            </select>
          </div>
        </div>

        {/* Row 2: Period presets + custom date range */}
        <div className="flex flex-wrap items-center gap-2">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.text.muted(isDark) }} />
          {[
            { id: 'all_time', label: 'All Time' },
            { id: 'this_month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: 'last_3_months', label: 'Last 3 Months' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => applyPreset(id)}
              style={period === id ? activePill : inactivePill(isDark)}
            >
              {label}
            </button>
          ))}

          {/* Custom range */}
          <div className="flex items-center gap-1.5 ml-auto">
            <input
              type="date"
              value={fromDate}
              onChange={e => handleCustomDate('from', e.target.value)}
              className="py-1.5 px-2 rounded-lg text-xs outline-none"
              style={{
                ...t.input(isDark),
                transition: 'background 0.4s ease, border-color 0.4s ease, color 0.4s ease',
              }}
            />
            <span className="text-xs" style={{ color: t.text.muted(isDark) }}>to</span>
            <input
              type="date"
              value={toDate}
              onChange={e => handleCustomDate('to', e.target.value)}
              className="py-1.5 px-2 rounded-lg text-xs outline-none"
              style={{
                ...t.input(isDark),
                transition: 'background 0.4s ease, border-color 0.4s ease, color 0.4s ease',
              }}
            />
            {(fromDate || toDate) && period !== 'all_time' && (
              <button
                onClick={() => applyPreset('all_time')}
                className="p-1 rounded"
                style={{ color: t.text.muted(isDark) }}
                title="Clear date filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Customer List ── */}
      {displayed.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={t.card(isDark)}>
          <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? '#4ade80' : '#16a34a' }} />
          <p className="font-semibold text-lg" style={{ color: t.text.primary(isDark) }}>
            {customers.length === 0 ? 'All Clear!' : 'No Results'}
          </p>
          <p className="text-sm mt-1" style={{ color: t.text.muted(isDark) }}>
            {customers.length === 0
              ? 'No outstanding Pay Later balances.'
              : 'No customers match the current filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((customer) => (
            <div
              key={customer.customer_phone}
              className="rounded-xl overflow-hidden"
              style={{ ...t.card(isDark), transition: 'background 0.4s ease, border-color 0.4s ease' }}
            >
              {/* Customer row */}
              <div className="flex items-center gap-4 p-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isDark ? 'rgba(244,63,94,0.15)' : 'rgba(244,63,94,0.08)',
                    border: '1px solid rgba(244,63,94,0.25)',
                  }}
                >
                  <User className="w-5 h-5" style={{ color: isDark ? '#fb7185' : '#e11d48' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                    {customer.customer_name || 'Unknown Customer'}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <Phone className="w-3 h-3" style={{ color: t.text.muted(isDark) }} />
                    <span className="text-xs" style={{ color: t.text.muted(isDark) }}>{customer.customer_phone}</span>
                    <span style={{ color: t.divider(isDark), margin: '0 4px' }}>·</span>
                    <span className="text-xs" style={{ color: t.text.muted(isDark) }}>
                      {customer.bill_count} bill{customer.bill_count !== 1 ? 's' : ''}
                    </span>
                    {customer.bills.some(b => b.payment_status === 'pay_later') && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: isDark ? 'rgba(244,63,94,0.15)' : 'rgba(244,63,94,0.08)',
                          color: isDark ? '#fb7185' : '#e11d48',
                        }}
                      >
                        UNPAID
                      </span>
                    )}
                    {customer.bills.some(b => b.payment_status === 'partial') && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.08)',
                          color: isDark ? '#fbbf24' : '#d97706',
                        }}
                      >
                        PARTIAL
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold" style={{ color: isDark ? '#fb7185' : '#e11d48' }}>
                    ₹{customer.total_due.toFixed(2)}
                  </p>
                  <p className="text-xs" style={{ color: t.text.muted(isDark) }}>outstanding</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openPaymentModal(customer)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                    style={{
                      background: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      color: isDark ? '#4ade80' : '#16a34a',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(34,197,94,0.25)' : 'rgba(34,197,94,0.18)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)' }}
                  >
                    Record Payment
                  </button>
                  <button
                    onClick={() => setExpandedPhone(expandedPhone === customer.customer_phone ? null : customer.customer_phone)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: t.text.muted(isDark), background: 'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    {expandedPhone === customer.customer_phone
                      ? <ChevronUp className="w-4 h-4" />
                      : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded bill list */}
              {expandedPhone === customer.customer_phone && (
                <div style={{ borderTop: `1px solid ${t.divider(isDark)}` }}>
                  {customer.bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{
                        background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(59,130,246,0.03)',
                        borderBottom: `1px solid ${t.divider(isDark)}`,
                        transition: 'background 0.4s ease',
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: t.text.primary(isDark) }}>
                            {bill.bill_number}
                          </span>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={
                              bill.payment_status === 'pay_later'
                                ? {
                                    background: isDark ? 'rgba(244,63,94,0.15)' : 'rgba(244,63,94,0.08)',
                                    color: isDark ? '#fb7185' : '#e11d48',
                                  }
                                : {
                                    background: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.08)',
                                    color: isDark ? '#fbbf24' : '#d97706',
                                  }
                            }
                          >
                            {bill.payment_status === 'pay_later' ? 'UNPAID' : 'PARTIAL'}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: t.text.muted(isDark) }}>
                          {new Date(bill.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}{bill.items_count} item{bill.items_count !== 1 ? 's' : ''}
                          {bill.notes && <span> · {bill.notes}</span>}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm" style={{ color: t.text.secondary(isDark) }}>
                          Bill: <span className="font-medium" style={{ color: t.text.primary(isDark) }}>₹{bill.total_amount.toFixed(2)}</span>
                        </p>
                        <p className="text-xs" style={{ color: t.text.muted(isDark) }}>Paid: ₹{bill.amount_paid.toFixed(2)}</p>
                        <p className="text-sm font-bold" style={{ color: isDark ? '#fb7185' : '#e11d48' }}>
                          Due: ₹{bill.amount_due.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Payment Modal ── */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={t.glassCard(isDark)}
          >
            <div className="p-6" style={{ borderBottom: `1px solid ${t.divider(isDark)}` }}>
              <h3 className="text-lg font-bold" style={{ color: t.text.primary(isDark) }}>Record Payment</h3>
              <p className="text-sm mt-1" style={{ color: t.text.secondary(isDark) }}>
                {paymentModal.name || paymentModal.phone}
                {' · '}Outstanding:{' '}
                <span className="font-semibold" style={{ color: isDark ? '#fb7185' : '#e11d48' }}>
                  ₹{paymentModal.totalDue.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'cash', label: 'Cash', Icon: Banknote },
                  { key: 'card', label: 'Card', Icon: CreditCard },
                  { key: 'online', label: 'Online', Icon: Wifi },
                ].map(({ key, label, Icon }) => (
                  <div key={key}>
                    <label
                      className="flex items-center gap-1 text-xs font-medium mb-1.5"
                      style={{ color: t.text.muted(isDark) }}
                    >
                      <Icon className="w-3 h-3" /> {label}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={paymentAmounts[key]}
                      onChange={e => setPaymentAmounts(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        ...t.input(isDark),
                        transition: 'background 0.4s ease, border-color 0.4s ease, color 0.4s ease',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: t.text.muted(isDark) }}>
                  Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="UPI / Transaction ID"
                  value={paymentReference}
                  onChange={e => setPaymentReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    ...t.input(isDark),
                    transition: 'background 0.4s ease, border-color 0.4s ease, color 0.4s ease',
                  }}
                />
              </div>

              <div
                className="flex justify-between items-center px-4 py-3 rounded-lg"
                style={t.innerRow(isDark)}
              >
                <span className="text-sm" style={{ color: t.text.secondary(isDark) }}>Total Entering</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: totalEntered > paymentModal.totalDue + 0.01 ? (isDark ? '#fb7185' : '#e11d48') : (isDark ? '#4ade80' : '#16a34a') }}
                >
                  ₹{totalEntered.toFixed(2)}
                </span>
              </div>

              {totalEntered > 0 && (
                <div
                  className="flex justify-between items-center px-4 py-2 rounded-lg"
                  style={t.innerRow(isDark)}
                >
                  <span className="text-xs" style={{ color: t.text.muted(isDark) }}>Remaining after payment</span>
                  <span className="text-sm font-semibold" style={{ color: t.text.secondary(isDark) }}>
                    ₹{Math.max(0, paymentModal.totalDue - totalEntered).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setPaymentModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.07)',
                  border: `1px solid ${t.divider(isDark)}`,
                  color: t.text.secondary(isDark),
                }}
                onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(59,130,246,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.07)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={paying || totalEntered <= 0 || totalEntered > paymentModal.totalDue + 0.01}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
                }}
              >
                {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {paying ? 'Recording…' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayLaterTab
