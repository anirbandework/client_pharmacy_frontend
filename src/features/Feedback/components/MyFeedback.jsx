import React, { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import PasswordProtectedRoute from '../../../components/PasswordProtectedRoute'
import { feedbackAPI } from '../services/feedbackApi'
import { MessageSquare, Star, Smile, Meh, Frown, Angry, Laugh, Rocket, Bug, Lightbulb, AlertCircle, Heart, Bookmark, User, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { useTheme } from '../../../contexts/ThemeContext'
import { t } from '../../../theme'

const MyFeedback = () => {
  const { isDark } = useTheme()
  const [feedbacks, setFeedbacks] = useState([])
  const [markingAsRead, setMarkingAsRead] = useState({})

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const res = await feedbackAPI.getMyFeedback()
      setFeedbacks(res.data)
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    }
  }

  const handleMarkAsRead = async (feedbackId) => {
    setMarkingAsRead(prev => ({ ...prev, [feedbackId]: true }))
    try {
      await feedbackAPI.markAsRead(feedbackId)
      fetchFeedback()
    } catch (error) {
      console.error('Failed to mark as read:', error)
    } finally {
      setMarkingAsRead(prev => ({ ...prev, [feedbackId]: false }))
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
      <PasswordProtectedRoute moduleName="My Feedback">
        <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">My Feedback</h1>
              <p className="text-white/90 text-xs md:text-sm">Track your feedback & responses</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div style={t.card(isDark)} className="rounded-xl shadow-lg p-8 md:p-12 text-center">
              <MessageSquare style={{ color: t.text.muted(isDark) }} className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
              <p style={{ color: t.text.secondary(isDark) }} className="text-sm md:text-base">No feedback submitted yet</p>
            </div>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb.id} style={t.card(isDark)} className="rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {React.createElement(getMoodIcon(fb.mood), { className: 'w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400' })}
                      {React.createElement(getTypeIcon(fb.feedback_type), { className: 'w-5 h-5 md:w-6 md:h-6 text-pink-600 dark:text-pink-400' })}
                    </div>
                    <div>
                      <h3 style={{ color: t.text.primary(isDark) }} className="text-base md:text-lg font-bold">{fb.title}</h3>
                      <p style={{ color: t.text.muted(isDark) }} className="text-xs mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(fb.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${fb.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : fb.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : fb.status === 'reviewed' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {fb.status.replace('_', ' ')}
                  </span>
                </div>

                <p style={{ color: t.text.secondary(isDark), ...t.innerRow(isDark) }} className="text-sm md:text-base p-3 md:p-4 rounded-lg mb-4">{fb.message}</p>

                {fb.satisfaction_rating != null && (
                  <div className="flex items-center gap-4 text-xs md:text-sm mb-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < fb.satisfaction_rating ? 'fill-purple-500 text-purple-500' : isDark ? 'text-slate-600' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span style={{ color: t.text.muted(isDark) }} className="text-xs">Rating: {fb.satisfaction_rating}/5</span>
                  </div>
                )}

                {fb.admin_response && (
                  <div style={{ background: 'rgba(99,102,241,0.08)', borderLeft: '4px solid #6366f1' }} className="p-3 md:p-4 rounded-lg relative">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span style={{ color: t.text.primary(isDark) }} className="font-semibold text-sm md:text-base">Response from {fb.responded_by || 'Admin'}</span>
                      {fb.status !== 'closed' && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">NEW</span>
                      )}
                      <span style={{ color: t.text.muted(isDark) }} className="text-xs">{new Date(fb.responded_at).toLocaleString()}</span>
                    </div>
                    <p style={{ color: t.text.secondary(isDark) }} className="text-sm md:text-base mb-3">{fb.admin_response}</p>
                    {fb.status !== 'closed' && (
                      <button
                        onClick={() => handleMarkAsRead(fb.id)}
                        disabled={markingAsRead[fb.id]}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 text-xs md:text-sm shadow-lg shadow-blue-500/20 w-full sm:w-auto justify-center disabled:opacity-50"
                      >
                        {markingAsRead[fb.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        {markingAsRead[fb.id] ? 'Marking...' : 'Got it, thanks!'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      </PasswordProtectedRoute>
    </Layout>
  )
}

export default MyFeedback
