import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PasswordProtectedRoute from '../../components/PasswordProtectedRoute';
import StaffNotifications from './components/StaffNotifications';
import StaffMyRequests from './components/StaffMyRequests';
import ErrorBoundary from '../../components/ErrorBoundary';
import useTabPermissions from '../../hooks/useTabPermissions';
import { Bell, Inbox, MessageSquare } from 'lucide-react';

export default function StaffNotificationsPage() {
  const [activeTab, setActiveTab] = useState('inbox');
  const { isTabEnabled, isLoaded } = useTabPermissions('my_notifications');

  const allTabs = [
    { id: 'inbox',    label: 'Inbox',        icon: Inbox },
    { id: 'requests', label: 'My Requests',   icon: MessageSquare },
  ];

  const tabs = allTabs.filter(t => isTabEnabled(t.id));

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
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
              {activeTab === 'inbox'    && <StaffNotifications />}
              {activeTab === 'requests' && <StaffMyRequests />}
            </ErrorBoundary>
          </div>
        </div>
      </PasswordProtectedRoute>
    </Layout>
  );
}
