import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import SendNotification from './components/SendNotification';
import SentNotifications from './components/SentNotifications';
import AdminStaffRequests from './components/AdminStaffRequests';
import ErrorBoundary from '../../components/ErrorBoundary';
import useTabPermissions from '../../hooks/useTabPermissions';
import { adminApi } from '../Admin&SuperAdmin/services/admin&superAminApi';
import { Bell, Send, List, MessageSquare, ChevronDown } from 'lucide-react';

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState('sent');
  const [showSendModal, setShowSendModal] = useState(false);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const { isTabEnabled, isLoaded } = useTabPermissions('notifications_admin');

  const allTabs = [
    { id: 'sent',     label: 'Sent',          icon: List },
    { id: 'requests', label: 'Staff Requests', icon: MessageSquare },
  ];

  const tabs = allTabs.filter(t => isTabEnabled(t.id));

  useEffect(() => {
    adminApi.getShops().then(data => {
      setShops(data);
      if (data.length > 0) setSelectedShop(data[0].shop_code);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [isLoaded]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Notifications</h1>
                <p className="text-white/90 text-xs md:text-sm">Send updates & view staff requests</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Shop selector */}
              {shops.length > 0 && (
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={selectedShop || ''}
                    onChange={e => setSelectedShop(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {shops.map(s => (
                      <option key={s.shop_code} value={s.shop_code} className="text-gray-900">
                        {s.shop_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
                </div>
              )}
              <button
                onClick={() => setShowSendModal(true)}
                className="bg-white text-purple-600 px-3 md:px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Content */}
        <div className="space-y-4 pb-20">
          <ErrorBoundary key={activeTab}>
            {activeTab === 'sent'     && <SentNotifications shopCode={selectedShop} />}
            {activeTab === 'requests' && <AdminStaffRequests shopCode={selectedShop} />}
          </ErrorBoundary>
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
