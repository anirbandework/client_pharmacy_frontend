import React, { useState } from 'react'
import { feedbackAPI } from '../services/feedbackApi'
import { X, Star, Smile, Meh, Frown, Angry, Laugh, Rocket, Bug, Lightbulb, AlertCircle, Heart, Bookmark, ThumbsUp, ThumbsDown, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '../../../contexts/ThemeContext'
import { t } from '../../../theme'

const FeedbackFormModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme()
  const [mood, setMood] = useState('')
  const [type, setType] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [recommend, setRecommend] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
    setSubmitting(true)
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
        onClose()
        resetForm()
        setSubmitted(false)
      }, 2000)
    } catch (error) {
      // Global error handler will show toast
    } finally {
      setSubmitting(false)
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

  if (!isOpen) return null

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div style={t.glassCard(isDark)} className="rounded-2xl shadow-2xl p-8 w-96 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500/20 backdrop-blur-xl p-4 rounded-full">
              <ThumbsUp className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 style={{ color: t.text.primary(isDark) }} className="text-2xl font-bold mb-2">Thank You!</h3>
          <p style={{ color: t.text.secondary(isDark) }}>Your feedback helps us improve!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div style={t.glassCard(isDark)} className="rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ color: t.text.primary(isDark) }} className="text-xl font-bold">Share Your Thoughts</h3>
          <button onClick={onClose} style={{ color: t.text.muted(isDark), transition: 'color 0.4s ease' }} className="hover:opacity-70 p-1 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p style={{ color: t.text.primary(isDark) }} className="text-sm font-medium mb-2">How are you feeling?</p>
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
            <p style={{ color: t.text.primary(isDark) }} className="text-sm font-medium mb-2">What's this about?</p>
            <div className="grid grid-cols-3 gap-2">
              {types.map((typeItem) => (
                <button
                  key={typeItem.value}
                  onClick={() => setType(typeItem.value)}
                  style={type === typeItem.value ? { background: 'rgba(99,102,241,0.15)', border: '2px solid #6366f1' } : t.innerRow(isDark)}
                  className="p-3 rounded-xl text-center transition-all hover:opacity-80"
                >
                  <typeItem.icon style={{ color: t.text.primary(isDark) }} className="w-6 h-6 mx-auto mb-1" />
                  <div style={{ color: t.text.primary(isDark) }} className="text-xs font-medium">{typeItem.title}</div>
                  <div style={{ color: t.text.secondary(isDark) }} className="text-xs">{typeItem.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Give it a catchy title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={t.input(isDark)}
            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />

          <textarea
            placeholder="Tell us more... we're all ears!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={t.input(isDark)}
            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all"
          />

          <div>
            <p style={{ color: t.text.primary(isDark) }} className="text-sm font-medium mb-2">Rate your experience</p>
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

          <div style={t.innerRow(isDark)} className="flex items-center justify-between p-3 rounded-lg">
            <span style={{ color: t.text.primary(isDark) }} className="text-sm font-medium">Would you recommend?</span>
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
            disabled={!mood || !type || !title || !message || submitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Sending...' : 'Send Feedback'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackFormModal
