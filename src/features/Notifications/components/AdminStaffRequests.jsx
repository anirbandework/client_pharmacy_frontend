import { useState, useEffect } from 'react';
import { notificationsApi } from '../services/notificationsApi';
import { MessageSquare, Check, X, Clock, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../../contexts/ThemeContext';
import { t } from '../../../theme';

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

export default function AdminStaffRequests({ shopCode }) {
  const { isDark } = useTheme();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { loadRequests(); }, [shopCode, statusFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await notificationsApi.getAdminStaffRequests(shopCode, statusFilter || null);
      setRequests(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id) => {
    setActionLoading(id + '_ack');
    try {
      await notificationsApi.acknowledgeRequest(id);
      toast.success('Request acknowledged');
      loadRequests();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismiss = async (id) => {
    setActionLoading(id + '_dis');
    try {
      await notificationsApi.dismissRequest(id);
      toast.success('Request dismissed');
      loadRequests();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div style={t.card(isDark)} className="rounded-xl shadow-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 style={{ color: t.text.primary(isDark) }} className="text-base md:text-lg font-bold">Staff Requests</h2>
            {pendingCount > 0 && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={t.input(isDark)}
              className="rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pending">Pending</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="dismissed">Dismissed</option>
              <option value="">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ color: t.text.secondary(isDark) }} className="text-center py-8">Loading...</div>
      ) : requests.length === 0 ? (
        <div style={t.card(isDark)} className="p-6 md:p-8 rounded-xl shadow-lg text-center">
          <span style={{ color: t.text.secondary(isDark) }}>No {statusFilter} requests</span>
        </div>
      ) : (
        requests.map(req => (
          <div
            key={req.id}
            style={{ ...t.card(isDark), borderWidth: '2px', borderColor: req.status === 'pending' ? '#fef3c7' : t.divider(isDark) }}
            className="p-4 rounded-xl shadow-lg"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 style={{ color: t.text.primary(isDark) }} className="font-bold text-sm md:text-base">{req.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${STATUS_COLORS[req.status]}`}>
                    {STATUS_ICONS[req.status]}
                    {req.status}
                  </span>
                </div>
                <p style={{ color: t.text.secondary(isDark) }} className="text-xs md:text-sm mb-2">{req.message}</p>
                <div style={{ color: t.text.muted(isDark) }} className="flex items-center gap-3 text-xs flex-wrap">
                  <span style={{ color: t.text.primary(isDark) }} className="font-medium">{req.staff_name}</span>
                  <span>{new Date(req.created_at).toLocaleString()}</span>
                  {req.acknowledged_by && (
                    <span className="text-green-600">by {req.acknowledged_by}</span>
                  )}
                </div>
              </div>

              {req.status === 'pending' && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleAcknowledge(req.id)}
                    disabled={actionLoading === req.id + '_ack'}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:from-green-600 hover:to-emerald-700 flex items-center gap-1 justify-center shadow-lg shadow-green-500/20 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleDismiss(req.id)}
                    disabled={actionLoading === req.id + '_dis'}
                    className="flex-1 sm:flex-none bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-200 flex items-center gap-1 justify-center disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
