import { useState } from 'react';
import Layout from '../../components/Layout';
import SendNotification from './components/SendNotification';
import SentNotifications from './components/SentNotifications';
import StaffNotifications from './components/StaffNotifications';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Send, List } from 'lucide-react';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('sent');
  const [showSendModal, setShowSendModal] = useState(false);
  const { user } = useAuth();
  
  // Get user type from localStorage as fallback
  const userType = localStorage.getItem('user_type') || user?.user_type;
  
  if (userType === 'staff') {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">My Notifications</h1>
                <p className="text-white/90 text-xs md:text-sm">View your notifications</p>
              </div>
            </div>
          </div>
          <StaffNotifications />
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'sent', label: 'Sent', icon: List, color: 'from-blue-500 to-blue-600' }
  ];

  // Admin view
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Notifications</h1>
                <p className="text-white/90 text-xs md:text-sm">Send updates to shops & staff</p>
              </div>
            </div>
            <button
              onClick={() => setShowSendModal(true)}
              className="bg-white text-purple-600 px-3 md:px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
            >
              <Send className="w-4 h-4" />
              Send Notification
            </button>
          </div>
        </div>

        <div className="mb-4 overflow-x-auto pb-2">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fade-in space-y-4">
          {activeTab === 'sent' && <SentNotifications />}
        </div>

        {showSendModal && (
          <SendNotification
            onClose={() => setShowSendModal(false)}
            onSuccess={() => window.location.reload()}
          />
        )}
      </div>
    </Layout>
  );
}
