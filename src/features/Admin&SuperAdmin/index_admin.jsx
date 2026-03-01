import { useState } from 'react';
import Layout from '../../components/Layout';
import ShopsManagement from './components/admin/ShopsManagement';
import StaffManagement from './components/admin/StaffManagement';
import { Store, Users, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('shops');

  const tabs = [
    { id: 'shops', label: 'Shops', icon: Store, color: 'from-blue-500 to-blue-600' },
    { id: 'staff', label: 'Staff', icon: Users, color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-white/90 text-xs md:text-sm">Manage shops & staff</p>
            </div>
          </div>
        </div>

        <div className="mb-4 md:mb-6 overflow-x-auto pb-2">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
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
          {activeTab === 'shops' && <ShopsManagement />}
          {activeTab === 'staff' && <StaffManagement />}
        </div>
      </div>
    </Layout>
  );
}
