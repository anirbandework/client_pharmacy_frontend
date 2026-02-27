import { useState, useEffect } from 'react';
import { superAdminApi } from '../../services/admin&superAminApi';
import { ChevronDown, ChevronRight, Users, Store, User, Edit2, Trash2, Eye, EyeOff, Briefcase, AlertTriangle, CheckCircle, XCircle, Ban } from 'lucide-react';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export default function AdminsHierarchy() {
  const [dashboard, setDashboard] = useState(null);
  const [expandedOrgs, setExpandedOrgs] = useState({});
  const [expandedShops, setExpandedShops] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editingShop, setEditingShop] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, entity: null, meta: null });
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', is_active: true });
  const [shopFormData, setShopFormData] = useState({ shop_name: '', address: '', phone: '', is_active: true });
  const [staffFormData, setStaffFormData] = useState({ name: '', phone: '', email: '', role: 'staff', is_active: true });

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const data = await superAdminApi.getDashboard();
      setDashboard(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (adminId) => {
    try {
      await superAdminApi.updateAdmin(adminId, formData);
      setEditingAdmin(null);
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateShop = async (shopId) => {
    try {
      await superAdminApi.updateShop(shopId, shopFormData);
      setEditingShop(null);
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStaff = async (staffId) => {
    try {
      await superAdminApi.updateStaff(staffId, staffFormData);
      setEditingStaff(null);
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (admin, orgId) => {
    const org = dashboard.organizations.find(o => o.organization_id === orgId);
    const isLastAdmin = org.admins.length === 1;
    setConfirmDialog({ isOpen: true, type: 'deleteAdmin', entity: admin, meta: { orgId, isLastAdmin, org } });
  };

  const handleToggleAdmin = (admin, orgId) => {
    setConfirmDialog({ isOpen: true, type: admin.is_active ? 'deactivateAdmin' : 'activateAdmin', entity: admin, meta: { orgId } });
  };

  const handleToggleShop = (shop) => {
    setConfirmDialog({ isOpen: true, type: shop.is_active ? 'deactivateShop' : 'activateShop', entity: shop });
  };

  const handleToggleStaff = (staff) => {
    setConfirmDialog({ isOpen: true, type: staff.is_active ? 'deactivateStaff' : 'activateStaff', entity: staff });
  };

  const handleDeleteShop = (shop) => {
    setConfirmDialog({ isOpen: true, type: 'deleteShop', entity: shop });
  };

  const handleDeleteStaff = (staff) => {
    setConfirmDialog({ isOpen: true, type: 'deleteStaff', entity: staff });
  };

  const confirmAction = async () => {
    const { type, entity, meta } = confirmDialog;
    setConfirmDialog({ isOpen: false, type: null, entity: null, meta: null });
    try {
      if (type === 'deleteAdmin') {
        const result = await superAdminApi.deleteAdmin(entity.id);
        alert(result.message + `\nShops deleted: ${result.shops_deleted}, Staff deleted: ${result.staff_deleted}`);
      } else if (type === 'deleteShop') {
        await superAdminApi.deleteShop(entity.id);
      } else if (type === 'deleteStaff') {
        await superAdminApi.deleteStaff(entity.id);
      } else if (type === 'deactivateAdmin' || type === 'activateAdmin') {
        await superAdminApi.updateAdmin(entity.id, { is_active: !entity.is_active });
      } else if (type === 'deactivateShop' || type === 'activateShop') {
        await superAdminApi.updateShop(entity.id, { is_active: !entity.is_active });
      } else if (type === 'deactivateStaff' || type === 'activateStaff') {
        await superAdminApi.updateStaff(entity.id, { is_active: !entity.is_active });
      }
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = (admin) => {
    setEditingAdmin(admin.id);
    setFormData({ full_name: admin.full_name, email: admin.email, phone: admin.phone, is_active: admin.is_active });
  };

  const startEditShop = (shop) => {
    setEditingShop(shop.id);
    setShopFormData({ shop_name: shop.shop_name, address: shop.address, phone: shop.phone, is_active: shop.is_active });
  };

  const startEditStaff = (staff) => {
    setEditingStaff(staff.id);
    setStaffFormData({ name: staff.name, phone: staff.phone, email: staff.email || '', role: staff.role, is_active: staff.is_active });
  };

  if (!dashboard) return <div className="text-center py-8 text-sm md:text-base">Loading...</div>;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 md:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-xs md:text-sm">Organizations</p>
              <p className="text-2xl md:text-3xl font-bold">{dashboard.total_organizations}</p>
            </div>
            <Briefcase className="w-10 h-10 md:w-12 md:h-12 text-indigo-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 md:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs md:text-sm">Total Admins</p>
              <p className="text-2xl md:text-3xl font-bold">{dashboard.total_admins}</p>
            </div>
            <Users className="w-10 h-10 md:w-12 md:h-12 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 md:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs md:text-sm">Total Shops</p>
              <p className="text-2xl md:text-3xl font-bold">{dashboard.total_shops}</p>
            </div>
            <Store className="w-10 h-10 md:w-12 md:h-12 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 md:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs md:text-sm">Total Staff</p>
              <p className="text-2xl md:text-3xl font-bold">{dashboard.total_staff}</p>
            </div>
            <User className="w-10 h-10 md:w-12 md:h-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="space-y-3 md:space-y-4">
        {dashboard.organizations.map(org => (
          <div key={org.organization_id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {/* Organization Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <button onClick={() => setExpandedOrgs(p => ({ ...p, [org.organization_id]: !p[org.organization_id] }))} className="mt-1">
                  {expandedOrgs[org.organization_id] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                <Briefcase className="w-6 h-6 text-indigo-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base md:text-lg font-bold text-gray-800">{org.organization_id}</h3>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 md:py-1 rounded-full text-xs font-semibold">{org.total_admins} admins</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 md:py-1 rounded-full text-xs font-semibold">{org.total_shops} shops</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 md:py-1 rounded-full text-xs font-semibold">{org.total_staff} staff</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">Shared access for all admins</p>
                </div>
              </div>
            </div>

            {/* Organization Content */}
            {expandedOrgs[org.organization_id] && (
              <div className="p-3 md:p-4 space-y-4">
                {/* Admins Section */}
                <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-100">
                  <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    Admins ({org.admins.length})
                  </h4>
                  <div className="space-y-2">
                    {org.admins.map(admin => (
                      <div key={admin.id} className="bg-white p-3 rounded-lg border border-blue-200">
                        {editingAdmin === admin.id ? (
                          <div className="space-y-2">
                            <input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="Full Name" />
                            <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="Phone" />
                            <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="Email" />
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                              Active
                            </label>
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdate(admin.id)} className="bg-green-500 text-white px-3 py-1 rounded text-xs">Save</button>
                              <button onClick={() => setEditingAdmin(null)} className="bg-gray-500 text-white px-3 py-1 rounded text-xs">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm md:text-base font-semibold text-gray-800">{admin.full_name}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${admin.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {admin.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <div className="text-xs md:text-sm text-gray-600 mt-1 space-y-0.5">
                                <p>📞 {admin.phone}</p>
                                {admin.email && <p>📧 {admin.email}</p>}
                                <p className="text-gray-500">Created: {new Date(admin.created_at).toLocaleString()}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span>🔑 Password: </span>
                                  {showPasswords[`admin-${admin.id}`] ? (
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{admin.plain_password || 'Not set'}</span>
                                  ) : (
                                    <span className="text-gray-400">••••••••</span>
                                  )}
                                  <button onClick={() => setShowPasswords(p => ({ ...p, [`admin-${admin.id}`]: !p[`admin-${admin.id}`] }))} className="text-blue-600 hover:text-blue-800">
                                    {showPasswords[`admin-${admin.id}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleToggleAdmin(admin, org.organization_id)} className={`p-1.5 ${admin.is_active ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition-all`} title={admin.is_active ? 'Deactivate' : 'Activate'}>
                                {admin.is_active ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                              </button>
                              <button onClick={() => startEdit(admin)} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDelete(admin, org.organization_id)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shops Section */}
                <div className="bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-100">
                  <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Store className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    Shared Shops ({org.shops.length})
                  </h4>
                  <div className="space-y-2">
                    {org.shops.length === 0 ? (
                      <p className="text-gray-500 text-xs md:text-sm italic">No shops yet</p>
                    ) : (
                      org.shops.map(shop => (
                        <div key={shop.id} className="bg-white rounded-lg border border-purple-200 overflow-hidden">
                          <div className="bg-purple-50 p-3 border-b border-gray-200">
                            {editingShop === shop.id ? (
                              <div className="space-y-2">
                                <input value={shopFormData.shop_name} onChange={(e) => setShopFormData({...shopFormData, shop_name: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="Shop Name" />
                                <input value={shopFormData.address} onChange={(e) => setShopFormData({...shopFormData, address: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="Address" />
                                <input value={shopFormData.phone} onChange={(e) => setShopFormData({...shopFormData, phone: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="Phone" />
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked={shopFormData.is_active} onChange={(e) => setShopFormData({...shopFormData, is_active: e.target.checked})} />
                                  Active
                                </label>
                                <div className="flex gap-2">
                                  <button onClick={() => handleUpdateShop(shop.id)} className="bg-green-500 text-white px-3 py-1 rounded text-xs">Save</button>
                                  <button onClick={() => setEditingShop(null)} className="bg-gray-500 text-white px-3 py-1 rounded text-xs">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-2">
                                <button onClick={() => setExpandedShops(p => ({ ...p, [shop.id]: !p[shop.id] }))} className="mt-0.5">
                                  {expandedShops[shop.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                                <Store className="w-5 h-5 text-purple-600 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm md:text-base font-semibold text-gray-800">{shop.shop_name}</h4>
                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">{shop.shop_code}</span>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">{shop.total_staff} staff</span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">📍 {shop.address}</p>
                                  <p className="text-xs text-gray-600">📞 {shop.phone}</p>
                                  <p className="text-xs text-gray-500">Created by: {shop.created_by_admin}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleToggleShop(shop)} className={`p-1.5 ${shop.is_active ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition-all`} title={shop.is_active ? 'Deactivate' : 'Activate'}>
                                    {shop.is_active ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                  </button>
                                  <button onClick={() => startEditShop(shop)} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDeleteShop(shop)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Staff */}
                          {expandedShops[shop.id] && (
                            <div className="p-2 md:p-3 space-y-2">
                              {shop.staff.length === 0 ? (
                                <p className="text-gray-500 text-xs md:text-sm italic">No staff yet</p>
                              ) : (
                                shop.staff.map(staff => (
                                  <div key={staff.id} className="bg-white p-3 rounded border border-gray-200">
                                    {editingStaff === staff.id ? (
                                      <div className="space-y-2">
                                        <input value={staffFormData.name} onChange={(e) => setStaffFormData({...staffFormData, name: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="Name" />
                                        <input value={staffFormData.phone} onChange={(e) => setStaffFormData({...staffFormData, phone: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="Phone" />
                                        <input value={staffFormData.email} onChange={(e) => setStaffFormData({...staffFormData, email: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="Email" />
                                        <select value={staffFormData.role} onChange={(e) => setStaffFormData({...staffFormData, role: e.target.value})} className="border p-2 rounded w-full text-sm">
                                          <option value="staff">Staff</option>
                                          <option value="manager">Manager</option>
                                        </select>
                                        <label className="flex items-center gap-2 text-sm">
                                          <input type="checkbox" checked={staffFormData.is_active} onChange={(e) => setStaffFormData({...staffFormData, is_active: e.target.checked})} />
                                          Active
                                        </label>
                                        <div className="flex gap-2">
                                          <button onClick={() => handleUpdateStaff(staff.id)} className="bg-green-500 text-white px-3 py-1 rounded text-xs">Save</button>
                                          <button onClick={() => setEditingStaff(null)} className="bg-gray-500 text-white px-3 py-1 rounded text-xs">Cancel</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-start gap-2">
                                        <User className="w-4 h-4 text-green-600 mt-0.5" />
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs md:text-sm font-semibold text-gray-800">{staff.name}</span>
                                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{staff.staff_code}</span>
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs capitalize">{staff.role}</span>
                                          </div>
                                          <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                                            <p>📞 {staff.phone}</p>
                                            {staff.email && <p>📧 {staff.email}</p>}
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span>🔑 Password: </span>
                                              {showPasswords[`staff-${staff.id}`] ? (
                                                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{staff.plain_password || 'Not set'}</span>
                                              ) : (
                                                <span className="text-gray-400">••••••••</span>
                                              )}
                                              <button onClick={() => setShowPasswords(p => ({ ...p, [`staff-${staff.id}`]: !p[`staff-${staff.id}`] }))} className="text-blue-600 hover:text-blue-800">
                                                {showPasswords[`staff-${staff.id}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                              </button>
                                            </div>
                                            {staff.last_login && <p className="text-gray-500">Last login: {new Date(staff.last_login).toLocaleString()}</p>}
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <button onClick={() => handleToggleStaff(staff)} className={`p-1.5 ${staff.is_active ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition-all`} title={staff.is_active ? 'Deactivate' : 'Activate'}>
                                            {staff.is_active ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                          </button>
                                          <button onClick={() => startEditStaff(staff)} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                                            <Edit2 className="w-3.5 h-3.5" />
                                          </button>
                                          <button onClick={() => handleDeleteStaff(staff)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: null, entity: null, meta: null })}
        onConfirm={confirmAction}
        title={
          confirmDialog.type === 'deleteAdmin' ? `Delete ${confirmDialog.entity?.full_name}?` :
          confirmDialog.type === 'deactivateAdmin' ? `Deactivate ${confirmDialog.entity?.full_name}?` :
          confirmDialog.type === 'activateAdmin' ? `Activate ${confirmDialog.entity?.full_name}?` :
          confirmDialog.type === 'deleteShop' ? `Delete ${confirmDialog.entity?.shop_name}?` :
          confirmDialog.type === 'deactivateShop' ? `Deactivate ${confirmDialog.entity?.shop_name}?` :
          confirmDialog.type === 'activateShop' ? `Activate ${confirmDialog.entity?.shop_name}?` :
          confirmDialog.type === 'deleteStaff' ? `Delete ${confirmDialog.entity?.name}?` :
          confirmDialog.type === 'deactivateStaff' ? `Deactivate ${confirmDialog.entity?.name}?` :
          confirmDialog.type === 'activateStaff' ? `Activate ${confirmDialog.entity?.name}?` : ''
        }
      >
        {confirmDialog.type === 'deleteAdmin' && confirmDialog.meta?.isLastAdmin ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 font-semibold">This is the LAST admin in {confirmDialog.meta.orgId}</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">All {confirmDialog.meta.org.total_shops} shops will be permanently deleted</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">All {confirmDialog.meta.org.total_staff} staff will be permanently deleted</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 font-semibold">This action cannot be undone</span>
            </div>
          </>
        ) : confirmDialog.type === 'deleteAdmin' ? (
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
        ) : confirmDialog.type === 'deactivateAdmin' ? (
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
              <span className="text-sm text-green-800">Shops and staff accessible to other admins in {confirmDialog.meta?.orgId}</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">Can be reactivated anytime</span>
            </div>
          </>
        ) : confirmDialog.type === 'activateAdmin' ? (
          <p className="text-gray-600">This admin will be able to login again.</p>
        ) : confirmDialog.type === 'deactivateShop' ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-orange-800">All staff in this shop cannot login</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">All historical data remains intact (bills, inventory, attendance, salary)</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">Shop data visible to admins but marked inactive</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">Can be reactivated anytime</span>
            </div>
          </>
        ) : confirmDialog.type === 'activateShop' ? (
          <p className="text-gray-600">This shop and all its staff will be able to login again.</p>
        ) : confirmDialog.type === 'deactivateStaff' ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-orange-800">Staff cannot login</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">All work history remains intact (bills, attendance, salary records)</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">Historical data preserved for auditing</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">Can be reactivated anytime</span>
            </div>
          </>
        ) : confirmDialog.type === 'activateStaff' ? (
          <p className="text-gray-600">This staff member will be able to login again.</p>
        ) : confirmDialog.type === 'deleteShop' ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">All {confirmDialog.entity?.total_staff} staff members will be permanently deleted</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 font-semibold">This action cannot be undone</span>
            </div>
          </>
        ) : confirmDialog.type === 'deleteStaff' ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">Staff member will be permanently deleted</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 font-semibold">This action cannot be undone</span>
            </div>
          </>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
