import { useState, useEffect } from 'react';
import { superAdminApi } from '../../services/admin&superAminApi';
import { Info, Edit2, Trash2, Ban, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export default function AdminsManagement() {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, admin: null, meta: null });
  const [loading, setLoading] = useState({ submit: false, toggle: null, delete: null, load: false });
  const [formData, setFormData] = useState({
    organization_id: '', phone: '', full_name: '', email: ''
  });

  useEffect(() => { loadAdmins(); }, []);

  const loadAdmins = async () => {
    setLoading(prev => ({ ...prev, load: true }));
    try {
      const data = await superAdminApi.getAllAdmins();
      setAdmins(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(prev => ({ ...prev, load: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submit: true }));
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
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ organization_id: admin.organization_id, phone: admin.phone, full_name: admin.full_name, email: admin.email || '' });
    setShowForm(true);
  };

  const handleDelete = (admin) => {
    const orgAdmins = groupedAdmins[admin.organization_id] || [];
    const isLastAdmin = orgAdmins.length === 1;
    setConfirmDialog({ isOpen: true, type: 'delete', admin, meta: { isLastAdmin, orgId: admin.organization_id } });
  };

  const handleToggleActive = (admin) => {
    setConfirmDialog({ isOpen: true, type: admin.is_active ? 'deactivate' : 'activate', admin });
  };

  const confirmAction = async () => {
    const { type, admin } = confirmDialog;
    setConfirmDialog({ isOpen: false, type: null, admin: null, meta: null });
    const actionType = type === 'delete' ? 'delete' : 'toggle';
    setLoading(prev => ({ ...prev, [actionType]: admin.id }));
    try {
      if (type === 'delete') {
        const result = await superAdminApi.deleteAdmin(admin.id);
        alert(`Deleted: ${result.shops_deleted} shops, ${result.staff_deleted} staff`);
      } else {
        await superAdminApi.updateAdmin(admin.id, { is_active: !admin.is_active });
      }
      loadAdmins();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(prev => ({ ...prev, [actionType]: null }));
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
          <button type="submit" disabled={loading.submit} className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
            {loading.submit && <Loader2 className="w-4 h-4 animate-spin" />}
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
                      <button onClick={() => handleToggleActive(admin)} disabled={loading.toggle === admin.id} className={`p-2 ${admin.is_active ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition-all disabled:opacity-50`} title={admin.is_active ? 'Deactivate' : 'Activate'}>
                        {loading.toggle === admin.id ? <Loader2 className="w-4 h-4 animate-spin" /> : admin.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleEdit(admin)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(admin)} disabled={loading.delete === admin.id} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50">
                        {loading.delete === admin.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: null, admin: null, meta: null })}
        onConfirm={confirmAction}
        title={
          confirmDialog.type === 'delete' ? `Delete ${confirmDialog.admin?.full_name}?` :
          confirmDialog.type === 'deactivate' ? `Deactivate ${confirmDialog.admin?.full_name}?` :
          `Activate ${confirmDialog.admin?.full_name}?`
        }
      >
        {confirmDialog.type === 'delete' && confirmDialog.meta?.isLastAdmin ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 font-semibold">This is the LAST admin in {confirmDialog.meta.orgId}</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">All shops will be permanently deleted</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">All staff will be permanently deleted</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 font-semibold">This action cannot be undone</span>
            </div>
          </>
        ) : confirmDialog.type === 'delete' ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">Shops and staff will remain accessible to other admins in {confirmDialog.meta?.orgId}</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 font-semibold">This action cannot be undone</span>
            </div>
          </>
        ) : confirmDialog.type === 'deactivate' ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-orange-800">Admin cannot login</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">All data remains intact</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">Shops and staff accessible to other admins in organization</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">Can be reactivated anytime</span>
            </div>
          </>
        ) : (
          <p className="text-gray-600">This admin will be able to login again.</p>
        )}
      </ConfirmDialog>
    </div>
  );
}
