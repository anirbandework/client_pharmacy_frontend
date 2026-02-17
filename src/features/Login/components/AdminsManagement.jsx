import { useState, useEffect } from 'react';
import { superAdminApi } from '../services/adminApi';
import { Info, Edit2, Trash2 } from 'lucide-react';

export default function AdminsManagement() {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    organization_id: '', phone: '', full_name: '', email: ''
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
      if (editingAdmin) {
        await superAdminApi.updateAdmin(editingAdmin.id, formData);
      } else {
        await superAdminApi.createAdmin(formData);
      }
      setShowForm(false);
      setEditingAdmin(null);
      setFormData({ organization_id: '', phone: '', full_name: '', email: '' });
      loadAdmins();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ organization_id: admin.organization_id, phone: admin.phone, full_name: admin.full_name, email: admin.email || '' });
    setShowForm(true);
  };

  const handleDelete = async (adminId, adminName) => {
    if (!confirm(`Delete ${adminName}? This will delete all their shops and staff!`)) return;
    try {
      const result = await superAdminApi.deleteAdmin(adminId);
      alert(`Deleted: ${result.shops_deleted} shops, ${result.staff_deleted} staff`);
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
          <h3 className="text-lg font-bold mb-4">{editingAdmin ? 'Edit Admin' : 'Create New Admin'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Organization ID" value={formData.organization_id} onChange={(e) => setFormData({...formData, organization_id: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required disabled={editingAdmin} />
            <input placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Admin will set their own password during first login</span>
          </div>
          <button type="submit" className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
            {editingAdmin ? 'Update Admin' : 'Create Admin'}
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
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(admin)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(admin.id, admin.full_name)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
