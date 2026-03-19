import { useState, useEffect } from 'react';
import { notificationsApi } from '../services/notificationsApi';
import { Eye, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../../contexts/ThemeContext';
import { t } from '../../../theme';

export default function SentNotifications({ shopCode }) {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, [shopCode]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsApi.getSentNotifications(shopCode);
      setNotifications(data);
      data.forEach(n => loadStats(n.id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (notificationId) => {
    try {
      const data = await notificationsApi.getNotificationStats(notificationId);
      setStats(prev => ({ ...prev, [notificationId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-blue-100 text-blue-700',
      warning: 'bg-yellow-100 text-yellow-700',
      urgent: 'bg-red-100 text-red-700',
      announcement: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || colors.info;
  };

  if (loading) return <div style={{ color: t.text.secondary(isDark) }} className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      {notifications.map(notif => {
        const stat = stats[notif.id];
        return (
          <div key={notif.id} style={t.card(isDark)} className="p-4 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 style={{ color: t.text.primary(isDark) }} className="font-bold text-sm md:text-base">{notif.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(notif.type)}`}>
                    {notif.type}
                  </span>
                </div>
                <p style={{ color: t.text.secondary(isDark) }} className="text-xs md:text-sm mb-2">{notif.message}</p>
                <div style={{ color: t.text.muted(isDark) }} className="flex items-center gap-4 text-xs flex-wrap">
                  <span>Target: {notif.target_type}</span>
                  <span>{new Date(notif.created_at).toLocaleString()}</span>
                  {notif.expires_at && <span>Expires: {new Date(notif.expires_at).toLocaleString()}</span>}
                </div>
              </div>
              {stat && (
                <div className="flex items-center gap-4 text-xs md:text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span className="font-semibold">{stat.total_read}/{stat.total_recipients}</span>
                    </div>
                    <p className="text-xs text-gray-500">Read</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{stat.read_percentage?.toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-gray-500">Rate</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
