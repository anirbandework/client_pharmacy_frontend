import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LockedModuleGuard from '../../components/LockedModuleGuard';
import SendNotification from './components/SendNotification';
import SentNotifications from './components/SentNotifications';
import AdminStaffRequests from './components/AdminStaffRequests';
import ErrorBoundary from '../../components/ErrorBoundary';
import useTabPermissions from '../../hooks/useTabPermissions';
import { adminApi } from '../Admin&SuperAdmin/services/admin&superAminApi';
import { Bell, Send, List, MessageSquare, Store, Lock, Crown, Star } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Locked Tab Overlay ───────────────────────────────────────────────────────

const LockedTabOverlay = ({ tab }) => (
  <div className="absolute inset-0 z-10 flex items-start justify-center px-4 pt-10" style={{ backdropFilter: 'blur(2px)', background: 'rgba(255,255,255,0.45)' }}>
    <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-2xl p-8 text-center w-full max-w-md">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
            <Lock className="w-7 h-7 text-indigo-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <Crown className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Premium Feature</h3>
      <p className="text-sm font-semibold text-indigo-600 mb-3 flex items-center justify-center gap-1.5">
        <tab.icon className="w-4 h-4" />
        {tab.label}
      </p>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        This tab is not included in your current plan. Upgrade to unlock{' '}
        <strong className="text-gray-700">{tab.label}</strong> and get access to powerful analytics & tools.
      </p>
      <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left space-y-2">
        {['Full access to all premium tabs', 'Priority support & updates', 'Advanced analytics & insights'].map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-indigo-700">
            <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" />
            {f}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Contact your administrator or reach out to us to upgrade your plan.
      </p>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState('sent');
  const [showSendModal, setShowSendModal] = useState(false);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const { isTabEnabled, isTabLocked, isLoaded } = useTabPermissions('notifications_admin');

  const allTabs = [
    { id: 'sent',     label: 'Sent',          icon: List },
    { id: 'requests', label: 'Staff Requests', icon: MessageSquare },
  ];

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
    if (isLoaded && !isTabEnabled(activeTab) && !isTabLocked(activeTab)) {
      const firstUnlocked = allTabs.find(t => !isTabLocked(t.id));
      if (firstUnlocked) setActiveTab(firstUnlocked.id);
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

        <LockedModuleGuard moduleKey="notifications_admin" moduleName="Notifications" moduleIcon={Bell}>

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
              {allTabs.map((tab) => {
                const locked = isTabLocked(tab.id);
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                      active
                        ? locked
                          ? 'text-white bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg'
                          : 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'
                        : locked
                          ? 'text-slate-500 hover:text-slate-400 hover:bg-slate-700/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {locked && (
                      <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 bg-amber-400 rounded-full flex-shrink-0">
                        <Lock className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
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
          <div className="relative">
          <div className={isTabLocked(activeTab) ? 'pointer-events-none select-none blur-sm' : ''}>
            <ErrorBoundary key={activeTab}>
              {activeTab === 'sent'     && <SentNotifications shopCode={selectedShop} />}
              {activeTab === 'requests' && <AdminStaffRequests shopCode={selectedShop} />}
            </ErrorBoundary>
          </div>
          {isTabLocked(activeTab) && (
            <LockedTabOverlay tab={allTabs.find(t => t.id === activeTab)} />
          )}
          </div>
        </div>

        </LockedModuleGuard>

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
