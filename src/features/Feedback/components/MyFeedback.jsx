import React, { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import PasswordProtectedRoute from '../../../components/PasswordProtectedRoute'
import { feedbackAPI } from '../services/feedbackApi'
import { MessageSquare, Star, Smile, Meh, Frown, Angry, Laugh, Rocket, Bug, Lightbulb, AlertCircle, Heart, Bookmark, User, Clock, CheckCircle } from 'lucide-react'

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([])

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
    try {
      await feedbackAPI.markAsRead(feedbackId)
      fetchFeedback()
    } catch (error) {
      console.error('Failed to mark as read:', error)
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
        <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Feedback</h1>
              <p className="text-white/90 text-sm">Track your feedback & responses</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No feedback submitted yet</p>
            </div>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {React.createElement(getMoodIcon(fb.mood), { className: 'w-6 h-6 text-purple-600' })}
                      {React.createElement(getTypeIcon(fb.feedback_type), { className: 'w-6 h-6 text-pink-600' })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{fb.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(fb.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${fb.status === 'pending' ? 'bg-orange-100 text-orange-700' : fb.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : fb.status === 'reviewed' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {fb.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 bg-gray-50 p-4 rounded-lg">{fb.message}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < fb.satisfaction_rating ? 'fill-purple-500 text-purple-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">Rating: {fb.satisfaction_rating}/5</span>
                </div>

                {fb.admin_response && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-500 p-4 rounded-lg relative">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-purple-900">Response from {fb.responded_by || 'Admin'}</span>
                      {fb.status !== 'closed' && (
                        <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">NEW</span>
                      )}
                      <span className="text-xs text-gray-500">{new Date(fb.responded_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{fb.admin_response}</p>
                    {fb.status !== 'closed' && (
                      <button
                        onClick={() => handleMarkAsRead(fb.id)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Got it, thanks!
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
