import { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';

export default function StaffManagement() {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '', phone: '', email: '', role: 'staff',
    can_manage_staff: false, can_view_analytics: true,
    can_manage_inventory: true, can_manage_customers: true
  });

  useEffect(() => { loadShops(); }, []);
  useEffect(() => { if (selectedShop) loadStaff(); }, [selectedShop]);

  const loadShops = async () => {
    try {
      const data = await adminApi.getShops();
      setShops(data);
      if (data.length > 0) setSelectedShop(data[0].id);
    } catch (err) {
      alert(err.message);
    }
  };

  const loadStaff = async () => {
    try {
      const data = await adminApi.getShopStaff(selectedShop);
      setStaff(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await adminApi.updateStaff(editingStaff.id, formData);
      } else {
        await adminApi.createStaff(selectedShop, formData);
      }
      setShowForm(false);
      setEditingStaff(null);
      setFormData({ full_name: '', phone: '', email: '', role: 'staff', can_manage_staff: false, can_view_analytics: true, can_manage_inventory: true, can_manage_customers: true });
      loadStaff();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (s) => {
    setEditingStaff(s);
    setFormData({ full_name: s.full_name, phone: s.phone, email: s.email, role: s.role, can_manage_staff: s.can_manage_staff, can_view_analytics: s.can_view_analytics, can_manage_inventory: s.can_manage_inventory, can_manage_customers: s.can_manage_customers });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this staff member?')) return;
    try {
      await adminApi.deleteStaff(id);
      loadStaff();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Select Shop:</label>
          <select value={selectedShop || ''} onChange={(e) => setSelectedShop(Number(e.target.value))} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64">
            {shops.map(shop => (
              <option key={shop.id} value={shop.id}>{shop.shop_name}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
          {showForm ? 'Cancel' : '+ Add Staff'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-4 border border-primary-100">
          <h3 className="text-lg font-bold mb-4">{editingStaff ? 'Edit Staff' : 'New Staff'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.can_manage_staff} onChange={(e) => setFormData({...formData, can_manage_staff: e.target.checked})} className="rounded" />
              Can Manage Staff
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.can_view_analytics} onChange={(e) => setFormData({...formData, can_view_analytics: e.target.checked})} className="rounded" />
              Can View Analytics
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.can_manage_inventory} onChange={(e) => setFormData({...formData, can_manage_inventory: e.target.checked})} className="rounded" />
              Can Manage Inventory
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.can_manage_customers} onChange={(e) => setFormData({...formData, can_manage_customers: e.target.checked})} className="rounded" />
              Can Manage Customers
            </label>
          </div>
          <button type="submit" className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
            {editingStaff ? 'Update' : 'Create'} Staff
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {staff.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-xl shadow-md border border-primary-100 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{s.full_name}</h3>
                <p className="text-sm text-gray-500 mb-2 font-mono bg-gray-100 inline-block px-2 py-1 rounded">UUID: {s.uuid}</p>
                <p className="text-sm text-gray-600">Phone: {s.phone}</p>
                {s.email && <p className="text-sm text-gray-600">Email: {s.email}</p>}
                <p className="text-sm text-gray-600">Role: <span className="font-semibold capitalize">{s.role}</span></p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.can_manage_staff && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">Manage Staff</span>}
                  {s.can_view_analytics && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">View Analytics</span>}
                  {s.can_manage_inventory && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">Manage Inventory</span>}
                  {s.can_manage_customers && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Manage Customers</span>}
                </div>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(s)} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:shadow-md transition-all">Edit</button>
                <button onClick={() => handleDelete(s.id)} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg text-sm hover:shadow-md transition-all">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
