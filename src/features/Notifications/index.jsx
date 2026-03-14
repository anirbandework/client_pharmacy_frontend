import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import SendNotification from './components/SendNotification';
import SentNotifications from './components/SentNotifications';
import AdminStaffRequests from './components/AdminStaffRequests';
import ErrorBoundary from '../../components/ErrorBoundary';
import useTabPermissions from '../../hooks/useTabPermissions';
import { adminApi } from '../Admin&SuperAdmin/services/admin&superAminApi';
import { Bell, Send, List, MessageSquare, Store } from 'lucide-react';
import toast from 'react-hot-toast';

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
    }).catch(err => {
      console.error(err);
      toast.error('Failed to fetch shops');
    });
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
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Notifications</h1>
              <p className="text-white/90 text-xs md:text-sm">Send updates & view staff requests</p>
            </div>
          </div>
        </div>

        {/* Shared Shop Filter */}
        <div className="bg-white rounded-xl shadow border border-slate-200 p-3 mb-4 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Store className="w-4 h-4 text-indigo-600" />
          </div>
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="flex-1 max-w-xs px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            {shops.map((shop) => (
              <option key={shop.shop_code} value={shop.shop_code}>{shop.shop_name}</option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="mb-4 overflow-x-auto pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 flex-1">
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
            <button
              onClick={() => setShowSendModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm whitespace-nowrap shadow-lg shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
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
