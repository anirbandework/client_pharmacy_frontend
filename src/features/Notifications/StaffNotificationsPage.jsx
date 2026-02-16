import Layout from '../../components/Layout';
import StaffNotifications from './components/StaffNotifications';
import { Bell } from 'lucide-react';

export default function StaffNotificationsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="hidden md:block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">My Notifications</h1>
              <p className="text-white/90 text-xs md:text-sm">View updates from management</p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in">
          <StaffNotifications />
        </div>
      </div>
    </Layout>
  );
}
