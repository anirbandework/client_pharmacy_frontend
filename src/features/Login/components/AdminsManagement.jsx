import { useState, useEffect } from 'react';
import { superAdminApi } from '../services/adminApi';

export default function AdminsManagement() {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    organization_id: '', phone: '', password: '', full_name: '', email: ''
  });

  useEffect(() => { loadAdmins(); }, []);

  const loadAdmins = async () => {
    try {
      const data = await superAdminApi.getAllAdmins();
      setAdmins(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await superAdminApi.createAdmin(formData);
      setShowForm(false);
      setFormData({ organization_id: '', phone: '', password: '', full_name: '', email: '' });
      loadAdmins();
    } catch (err) {
      alert(err.message);
    }
  };

  const groupByOrg = () => {
    return admins.reduce((acc, admin) => {
      const org = admin.organization_id || 'No Organization';
      if (!acc[org]) acc[org] = [];
      acc[org].push(admin);
      return acc;
    }, {});
  };

  const groupedAdmins = groupByOrg();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
          {showForm ? 'Cancel' : '+ Create Admin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-4 border border-primary-100">
          <h3 className="text-lg font-bold mb-4">Create New Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Organization ID" value={formData.organization_id} onChange={(e) => setFormData({...formData, organization_id: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <input placeholder="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
          </div>
          <button type="submit" className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
            Create Admin
          </button>
        </form>
      )}

      <div className="space-y-6">
        {Object.entries(groupedAdmins).map(([orgId, orgAdmins]) => (
          <div key={orgId} className="bg-white p-4 rounded-xl shadow-md border border-primary-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{orgId}</span>
              <span className="text-sm text-gray-500">({orgAdmins.length} admin{orgAdmins.length > 1 ? 's' : ''})</span>
            </h3>
            <div className="grid gap-3">
              {orgAdmins.map(admin => (
                <div key={admin.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{admin.full_name}</p>
                      <p className="text-sm text-gray-600">Phone: {admin.phone}</p>
                      {admin.email && <p className="text-sm text-gray-600">Email: {admin.email}</p>}
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${admin.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
