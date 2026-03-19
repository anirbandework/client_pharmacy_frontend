import { useState, useEffect } from 'react';
import { notificationsApi } from '../services/notificationsApi';
import { MessageSquare, Plus, Send, Check, X, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../../contexts/ThemeContext';
import { t } from '../../../theme';

const QUICK_TITLES = [
  'Need billing paper',
  'Need stationery',
  'Technical issue',
  'Stock issue',
  'Other request',
];

const STATUS_COLORS = {
  pending:      'bg-yellow-100 text-yellow-700 border-yellow-200',
  acknowledged: 'bg-green-100  text-green-700  border-green-200',
  dismissed:    'bg-slate-100  text-slate-500  border-slate-200',
};

const STATUS_ICONS = {
  pending:      <Clock className="w-3 h-3" />,
  acknowledged: <Check className="w-3 h-3" />,
  dismissed:    <X className="w-3 h-3" />,
};

export default function StaffMyRequests() {
  const { isDark } = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await notificationsApi.getMyRequests();
      setRequests(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await notificationsApi.sendStaffRequest(form);
      toast.success('Request sent to admin');
      setForm({ title: '', message: '' });
      setShowForm(false);
      loadRequests();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div style={t.card(isDark)} className="rounded-xl shadow-lg p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 style={{ color: t.text.primary(isDark) }} className="text-base md:text-lg font-bold">My Requests</h2>
            <span style={{ color: t.text.muted(isDark) }} className="text-xs">({requests.length} total)</span>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-xs md:text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      {/* Send form */}
      {showForm && (
        <div style={{ ...t.card(isDark), borderWidth: '2px', borderColor: '#c4b5fd' }} className="rounded-xl shadow-lg p-4">
          <h3 style={{ color: t.text.primary(isDark) }} className="font-bold mb-3 text-sm md:text-base">Send Request to Admin</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Quick titles */}
            <div>
              <p style={{ color: t.text.muted(isDark) }} className="text-xs mb-1.5">Quick select:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TITLES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, title: t }))}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      form.title === t
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-gray-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ color: t.text.primary(isDark) }} className="block text-xs font-medium mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Need billing paper for shop"
                maxLength={200}
                style={t.input(isDark)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label style={{ color: t.text.primary(isDark) }} className="block text-xs font-medium mb-1">Message *</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Describe what you need..."
                rows={3}
                style={t.input(isDark)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm({ title: '', message: '' }); }}
                style={{ color: t.text.secondary(isDark) }}
                className="px-4 py-2 rounded-lg text-sm hover:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 flex items-center gap-1.5 disabled:opacity-50 shadow-lg shadow-purple-500/20"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests list */}
      {loading ? (
        <div style={{ color: t.text.secondary(isDark) }} className="text-center py-8">Loading...</div>
      ) : requests.length === 0 ? (
        <div style={t.card(isDark)} className="p-6 md:p-8 rounded-xl shadow-lg text-center">
          <span style={{ color: t.text.secondary(isDark) }}>No requests sent yet</span>
        </div>
      ) : (
        requests.map(req => (
          <div
            key={req.id}
            style={{ ...t.card(isDark), borderWidth: '2px', borderColor: req.status === 'pending' ? '#fef3c7' : req.status === 'acknowledged' ? '#bbf7d0' : t.divider(isDark) }}
            className="p-4 rounded-xl shadow-lg"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 style={{ color: t.text.primary(isDark) }} className="font-bold text-sm md:text-base">{req.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${STATUS_COLORS[req.status]}`}>
                    {STATUS_ICONS[req.status]}
                    {req.status}
                  </span>
                </div>
                <p style={{ color: t.text.secondary(isDark) }} className="text-xs md:text-sm mb-1.5">{req.message}</p>
                <div style={{ color: t.text.muted(isDark) }} className="flex items-center gap-3 text-xs flex-wrap">
                  <span>{new Date(req.created_at).toLocaleString()}</span>
                  {req.acknowledged_by && (
                    <span className="text-green-600">Handled by {req.acknowledged_by}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
