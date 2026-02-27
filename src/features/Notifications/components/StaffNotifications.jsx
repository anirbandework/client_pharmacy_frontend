import { useState, useEffect } from 'react';
import { notificationsApi } from '../services/notificationsApi';
import { Bell, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [includeRead, setIncludeRead] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, [includeRead]);
  
  useEffect(() => {
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [includeRead]);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getStaffNotifications(includeRead);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      toast.success('Marked as read');
      loadNotifications();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-blue-100 text-blue-700 border-blue-200',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      urgent: 'bg-red-100 text-red-700 border-red-200',
      announcement: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[type] || colors.info;
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={includeRead}
            onChange={(e) => setIncludeRead(e.target.checked)}
            className="rounded"
          />
          Show read
        </label>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center text-gray-500">
          No notifications
        </div>
      ) : (
        notifications.map(notif => (
          <div
            key={notif.id}
            className={`bg-white p-4 rounded-xl shadow-md border-2 ${notif.is_read ? 'border-gray-200 opacity-75' : 'border-primary-200'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-800">{notif.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(notif.type)}`}>
                    {notif.type}
                  </span>
                  {notif.is_read && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Read
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">{notif.message}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{new Date(notif.created_at).toLocaleString()}</span>
                  {notif.expires_at && (
                    <span className="text-orange-600">
                      Expires: {new Date(notif.expires_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              {!notif.is_read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="ml-4 bg-primary-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-600 flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Mark Read
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
