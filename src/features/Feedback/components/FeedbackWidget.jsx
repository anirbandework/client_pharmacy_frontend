import React, { useState, useEffect } from 'react'
import { feedbackAPI } from '../services/feedbackApi'
import { MessageCircle, Send, X, Star, Smile, Meh, Frown, Angry, Laugh, Rocket, Bug, Lightbulb, AlertCircle, Heart, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const FeedbackWidget = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mood, setMood] = useState('')
  const [type, setType] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [recommend, setRecommend] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 300000)
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const res = await feedbackAPI.getUnreadCount()
      setUnreadCount(res.data.unread_responses)
    } catch (error) {
      // Silently ignore 429 (rate limit) errors to avoid annoying toasts
      if (error.response?.status !== 429) {
        console.error('Failed to fetch unread count:', error)
      }
    }
  }

  const moods = [
    { value: 'excited', icon: Laugh, label: 'Excited', color: 'bg-green-100 hover:bg-green-200 text-green-700' },
    { value: 'happy', icon: Smile, label: 'Happy', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700' },
    { value: 'neutral', icon: Meh, label: 'Neutral', color: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
    { value: 'frustrated', icon: Frown, label: 'Frustrated', color: 'bg-orange-100 hover:bg-orange-200 text-orange-700' },
    { value: 'angry', icon: Angry, label: 'Angry', color: 'bg-red-100 hover:bg-red-200 text-red-700' }
  ]

  const types = [
    { value: 'feature_request', icon: Rocket, title: 'Feature', desc: 'New idea' },
    { value: 'bug_report', icon: Bug, title: 'Bug', desc: 'Not working' },
    { value: 'improvement', icon: Lightbulb, title: 'Improve', desc: 'Make better' },
    { value: 'complaint', icon: AlertCircle, title: 'Issue', desc: 'Problem' },
    { value: 'appreciation', icon: Heart, title: 'Thanks', desc: 'Appreciate' },
    { value: 'other', icon: Bookmark, title: 'Other', desc: 'Something else' }
  ]

  const handleSubmit = async () => {
    try {
      await feedbackAPI.submitFeedback({
        feedback_type: type,
        mood,
        title,
        message,
        satisfaction_rating: rating,
        would_recommend: recommend
      })
      setSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setSubmitted(false)
        resetForm()
      }, 2000)
    } catch (error) {
      // Global error handler will show toast
    }
  }

  const resetForm = () => {
    setMood('')
    setType('')
    setTitle('')
    setMessage('')
    setRating(5)
    setRecommend(true)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
        <button
          onClick={() => navigate('/my-feedback')}
          className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-200/50 shadow-2xl text-purple-600 px-4 py-3 rounded-full hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center gap-2 font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          My Feedback
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-200/50 shadow-2xl text-purple-600 p-4 rounded-full hover:shadow-purple-500/50 transition-all hover:scale-110"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="fixed bottom-6 left-6 bg-gradient-to-br from-green-50/95 to-emerald-50/95 backdrop-blur-2xl border border-green-200/50 rounded-2xl shadow-2xl p-8 w-96 z-50 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 backdrop-blur-xl p-4 rounded-full">
            <ThumbsUp className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">Thank You!</h3>
        <p className="text-gray-600">Your feedback helps us improve!</p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 bg-gradient-to-br from-purple-50/95 to-pink-50/95 backdrop-blur-2xl border border-purple-200/50 rounded-2xl shadow-2xl p-6 w-96 max-h-[600px] overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2 rounded-xl">
            <MessageCircle className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Share Your Thoughts</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 p-1 rounded-lg transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">How are you feeling?</p>
          <div className="flex gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex-1 p-2 rounded-xl text-center transition-all ${m.color} ${mood === m.value ? 'ring-2 ring-purple-500 scale-105 shadow-lg' : ''}`}
              >
                <m.icon className="w-6 h-6 mx-auto" />
                <div className="text-xs mt-1">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">What's this about?</p>
          <div className="grid grid-cols-3 gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`p-3 rounded-xl text-center transition-all ${type === t.value ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-2 ring-purple-500 shadow-lg' : 'bg-white/50 hover:bg-white/80'}`}
              >
                <t.icon className="w-6 h-6 mx-auto mb-1 text-gray-700" />
                <div className="text-xs font-medium">{t.title}</div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="Give it a catchy title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
        />

        <textarea
          placeholder="Tell us more... we're all ears!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all"
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Rate your experience</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-all hover:scale-125"
              >
                <Star className={`w-8 h-8 ${star <= rating ? 'fill-purple-500 text-purple-500' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-xl rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Would you recommend?</span>
          <button
            onClick={() => setRecommend(!recommend)}
            className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${recommend ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-gray-200 text-gray-700'}`}
          >
            {recommend ? (
              <><ThumbsUp className="w-4 h-4" /> Yes</>
            ) : (
              <><ThumbsDown className="w-4 h-4" /> Not yet</>
            )}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!mood || !type || !title || !message}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Feedback
        </button>
      </div>
    </div>
  )
}

export default FeedbackWidget
