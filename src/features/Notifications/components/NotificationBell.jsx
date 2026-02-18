import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { notificationsApi } from '../services/notificationsApi';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const userType = localStorage.getItem('user_type');
  
  useEffect(() => {
    if (userType !== 'staff') return;
    
    const fetchCount = async () => {
      try {
        const data = await notificationsApi.getUnreadCount();
        setUnreadCount(data.unread_count);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [userType]);

  if (userType !== 'staff') return null;

  return (
    <div className="relative">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
}