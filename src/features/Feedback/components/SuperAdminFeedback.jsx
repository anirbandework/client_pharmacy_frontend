import React, { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import { feedbackAPI } from '../services/feedbackApi'
import { MessageSquare, TrendingUp, Users, Star, Smile, Meh, Frown, Angry, Laugh, Rocket, Bug, Lightbulb, AlertCircle, Heart, Bookmark, Phone, Building, User, Loader2 } from 'lucide-react'
import { useTheme } from '../../../contexts/ThemeContext'
import { t } from '../../../theme'

const SuperAdminFeedback = () => {
  const { isDark } = useTheme()
  const [feedbacks, setFeedbacks] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState({ status: '', feedback_type: '', user_type: '' })
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState('')
  const [responding, setResponding] = useState(false)

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    try {
      const [feedbackRes, statsRes] = await Promise.all([
        feedbackAPI.getAllFeedback(filter),
        feedbackAPI.getFeedbackStats()
      ])
      setFeedbacks(feedbackRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    }
  }

  const handleRespond = async () => {
    setResponding(true)
    try {
      await feedbackAPI.respondToFeedback(selectedFeedback.id, {
        status,
        admin_response: response
      })
      setSelectedFeedback(null)
      setResponse('')
      setStatus('')
      fetchData()
    } catch (error) {
      // Global error handler will show toast
    } finally {
      setResponding(false)
    }
  }

  const getMoodIcon = (mood) => {
    const icons = { excited: Laugh, happy: Smile, neutral: Meh, frustrated: Frown, angry: Angry }
    return icons[mood] || Meh
  }

  const getTypeIcon = (type) => {
    const icons = { feature_request: Rocket, bug_report: Bug, improvement: Lightbulb, complaint: AlertCircle, appreciation: Heart, other: Bookmark }
    return icons[type] || Bookmark
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Feedback Management</h1>
              <p className="text-white/90 text-xs md:text-sm">Monitor & respond to user feedback</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 md:p-4 rounded-xl shadow-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-blue-900">Total Feedback</p>
                </div>
                <p className="text-xl md:text-2xl font-bold text-blue-900">{stats.total_feedback}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 md:p-4 rounded-xl shadow-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-orange-900">Pending</p>
                </div>
                <p className="text-xl md:text-2xl font-bold text-orange-900">{stats.pending}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 md:p-4 rounded-xl shadow-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-purple-900">Avg Rating</p>
                </div>
                <p className="text-xl md:text-2xl font-bold text-purple-900">{stats.average_satisfaction?.toFixed(1)}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 md:p-4 rounded-xl shadow-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-green-900">Recommend Rate</p>
                </div>
                <p className="text-xl md:text-2xl font-bold text-green-900">{stats.recommendation_rate?.toFixed(1)}%</p>
              </div>
            </div>
          )}

          <div style={t.card(isDark)} className="rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} style={t.input(isDark)} className="w-full sm:w-auto px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select value={filter.feedback_type} onChange={(e) => setFilter({ ...filter, feedback_type: e.target.value })} style={t.input(isDark)} className="w-full sm:w-auto px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                <option value="">All Types</option>
                <option value="feature_request">Feature Request</option>
                <option value="bug_report">Bug Report</option>
                <option value="improvement">Improvement</option>
                <option value="complaint">Complaint</option>
                <option value="appreciation">Appreciation</option>
                <option value="other">Other</option>
              </select>
              <select value={filter.user_type} onChange={(e) => setFilter({ ...filter, user_type: e.target.value })} style={t.input(isDark)} className="w-full sm:w-auto px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                <option value="">All Users</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div key={fb.id} style={{ ...t.innerRow(isDark), borderColor: t.divider(isDark) }} className="rounded-xl p-5 hover:shadow-lg cursor-pointer transition-all" onClick={() => setSelectedFeedback(fb)}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        {React.createElement(getMoodIcon(fb.mood), { className: 'w-5 h-5 text-purple-600 dark:text-purple-400' })}
                        {React.createElement(getTypeIcon(fb.feedback_type), { className: 'w-5 h-5 text-pink-600 dark:text-pink-400' })}
                      </div>
                      <div>
                        <h4 style={{ color: t.text.primary(isDark) }} className="font-bold">{fb.title}</h4>
                        <p style={{ color: t.text.muted(isDark) }} className="text-xs mt-1">{fb.user_name} • <span className="capitalize">{fb.user_type}</span></p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${fb.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : fb.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {fb.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p style={{ color: t.text.secondary(isDark) }} className="text-sm mb-3 line-clamp-2">{fb.message}</p>
                  <div style={{ color: t.text.muted(isDark) }} className="flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{fb.user_phone}</span>
                    {fb.shop_name && <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />{fb.shop_name}</span>}
                    <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-purple-500 text-purple-500" />{fb.satisfaction_rating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedFeedback && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div style={t.glassCard(isDark)} className="rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
                <h3 style={{ color: t.text.primary(isDark) }} className="text-2xl font-bold mb-6">Respond to Feedback</h3>
                <div style={t.innerRow(isDark)} className="space-y-4 mb-6 p-4 rounded-xl">
                  <p style={{ color: t.text.secondary(isDark) }} className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-purple-600 dark:text-purple-400" /><strong>From:</strong> {selectedFeedback.user_name} <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs">{selectedFeedback.user_type}</span></p>
                  <p style={{ color: t.text.secondary(isDark) }} className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" /><strong>Phone:</strong> {selectedFeedback.user_phone}</p>
                  {selectedFeedback.shop_name && <p style={{ color: t.text.secondary(isDark) }} className="flex items-center gap-2 text-sm"><Building className="w-4 h-4 text-purple-600 dark:text-purple-400" /><strong>Shop:</strong> {selectedFeedback.shop_name} - {selectedFeedback.shop_location}</p>}
                  {selectedFeedback.admin_name && <p style={{ color: t.text.secondary(isDark) }} className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-purple-600 dark:text-purple-400" /><strong>Admin:</strong> {selectedFeedback.admin_name} ({selectedFeedback.admin_phone})</p>}
                  <div style={{ borderColor: t.divider(isDark) }} className="pt-3 border-t">
                    <p style={{ color: t.text.primary(isDark) }} className="font-semibold mb-2">{selectedFeedback.title}</p>
                    <p style={{ color: t.text.secondary(isDark) }} className="text-sm">{selectedFeedback.message}</p>
                  </div>
                </div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={t.input(isDark)} className="w-full px-4 py-3 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Select Status</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <textarea
                  placeholder="Your response..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  style={t.input(isDark)}
                  className="w-full px-4 py-3 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />
                <div className="flex gap-3">
                  <button onClick={handleRespond} disabled={responding} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {responding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {responding ? 'Sending...' : 'Send Response'}
                  </button>
                  <button onClick={() => setSelectedFeedback(null)} style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: t.text.primary(isDark) }} className="px-6 py-3 rounded-xl font-semibold hover:opacity-80 transition-all">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default SuperAdminFeedback
