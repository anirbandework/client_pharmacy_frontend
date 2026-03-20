import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LockedModuleGuard from '../../components/LockedModuleGuard';
import PasswordProtectedRoute from '../../components/PasswordProtectedRoute';
import StaffNotifications from './components/StaffNotifications';
import StaffMyRequests from './components/StaffMyRequests';
import ErrorBoundary from '../../components/ErrorBoundary';
import useTabPermissions from '../../hooks/useTabPermissions';
import { Bell, Inbox, MessageSquare, Lock, Crown, Star } from 'lucide-react';

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

export default function StaffNotificationsPage() {
  const [activeTab, setActiveTab] = useState('inbox');
  const { isTabEnabled, isTabLocked, isLoaded } = useTabPermissions('my_notifications');

  const allTabs = [
    { id: 'inbox',    label: 'Inbox',        icon: Inbox },
    { id: 'requests', label: 'My Requests',   icon: MessageSquare },
  ];

  useEffect(() => {
    if (isLoaded && !isTabEnabled(activeTab) && !isTabLocked(activeTab)) {
      const firstUnlocked = allTabs.find(t => !isTabLocked(t.id));
      if (firstUnlocked) setActiveTab(firstUnlocked.id);
    }
  }, [isLoaded]);

  return (
    <Layout>
      <PasswordProtectedRoute moduleName="Notifications">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">My Notifications</h1>
                <p className="text-white/90 text-xs md:text-sm">Inbox & send requests to admin</p>
              </div>
            </div>
          </div>

          <LockedModuleGuard moduleKey="my_notifications" moduleName="My Notifications" moduleIcon={Bell}>

          {/* Tabs */}
          <div className="mb-4 overflow-x-auto pb-2">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
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
          </div>

          {/* Content */}
          <div className="space-y-4 pb-20">
            <div className="relative">
            <div className={isTabLocked(activeTab) ? 'pointer-events-none select-none blur-sm' : ''}>
              <ErrorBoundary key={activeTab}>
                {activeTab === 'inbox'    && <StaffNotifications />}
                {activeTab === 'requests' && <StaffMyRequests />}
              </ErrorBoundary>
            </div>
            {isTabLocked(activeTab) && (
              <LockedTabOverlay tab={allTabs.find(t => t.id === activeTab)} />
            )}
            </div>
          </div>

          </LockedModuleGuard>
        </div>
      </PasswordProtectedRoute>
    </Layout>
  );
}
