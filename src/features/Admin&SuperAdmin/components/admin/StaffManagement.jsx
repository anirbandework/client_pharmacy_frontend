import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin&superAminApi';
import { ChevronDown, ChevronUp, Info, Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export default function StaffManagement() {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [expandedStaff, setExpandedStaff] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, staff: null });
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', role: 'staff', staff_code: '', monthly_salary: '',
    joining_date: '', salary_eligibility_days: 4,
    can_manage_staff: false, can_view_analytics: true,
    can_manage_inventory: true, can_manage_customers: true
  });

  useEffect(() => { loadShops(); }, []);
  useEffect(() => { if (selectedShop) loadStaff(); }, [selectedShop]);

  const loadShops = async () => {
    try {
      const data = await adminApi.getShops();
      setShops(data);
      if (data.length > 0) setSelectedShop(data[0].shop_code);
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
      setFormData({ name: '', phone: '', email: '', role: 'staff', staff_code: '', monthly_salary: '', joining_date: '', salary_eligibility_days: 4, can_manage_staff: false, can_view_analytics: true, can_manage_inventory: true, can_manage_customers: true });
      loadStaff();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (s) => {
    setEditingStaff(s);
    setFormData({ name: s.name, phone: s.phone, email: s.email, role: s.role, staff_code: s.staff_code, monthly_salary: s.monthly_salary || 0, joining_date: s.joining_date || '', salary_eligibility_days: s.salary_eligibility_days || 4, can_manage_staff: s.can_manage_staff, can_view_analytics: s.can_view_analytics, can_manage_inventory: s.can_manage_inventory, can_manage_customers: s.can_manage_customers });
    setShowForm(true);
  };

  const handleToggleActive = (staff) => {
    setConfirmDialog({ isOpen: true, staff });
  };

  const confirmToggleActive = async () => {
    const staff = confirmDialog.staff;
    setConfirmDialog({ isOpen: false, staff: null });
    try {
      await adminApi.updateStaff(staff.id, { is_active: !staff.is_active });
      loadStaff();
    } catch (err) {
      alert(err.message);
    }
  };

  const calculatePaymentDate = (joiningDate, paymentDays) => {
    if (!joiningDate) return 'Not set';
    const joinDate = new Date(joiningDate);
    const paymentDate = new Date(joinDate);
    paymentDate.setDate(joinDate.getDate() + paymentDays);
    return paymentDate.toLocaleDateString('en-GB');
  };

  const toggleExpand = (staffId) => {
    setExpandedStaff(prev => ({ ...prev, [staffId]: !prev[staffId] }));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Select Shop:</label>
          <select value={selectedShop || ''} onChange={(e) => setSelectedShop(e.target.value)} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64">
            {shops.map(shop => (
              <option key={shop.id} value={shop.shop_code}>{shop.shop_name}</option>
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
            <input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Staff Code" value={formData.staff_code} onChange={(e) => setFormData({...formData, staff_code: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required={!editingStaff} disabled={editingStaff} />
            <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <input placeholder="Monthly Salary" type="number" value={formData.monthly_salary} onChange={(e) => setFormData({...formData, monthly_salary: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Joining Date</label>
              <input type="date" value={formData.joining_date} onChange={(e) => setFormData({...formData, joining_date: e.target.value})} max={new Date().toISOString().split('T')[0]} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Payment After Days</label>
              <input type="number" value={formData.salary_eligibility_days} onChange={(e) => setFormData({...formData, salary_eligibility_days: e.target.value})} min="0" placeholder="Days after joining to pay salary" className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full" />
            </div>
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
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Staff will set their own password during first login</span>
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
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-800">{s.name}</h3>
                  <button onClick={() => toggleExpand(s.id)} className="p-1 hover:bg-gray-100 rounded">
                    {expandedStaff[s.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-2 font-mono bg-gray-100 inline-block px-2 py-1 rounded">UUID: {s.uuid}</p>
                <p className="text-sm text-gray-600">Staff Code: <span className="font-semibold">{s.staff_code}</span></p>
                
                {expandedStaff[s.id] && (
                  <>
                    <p className="text-sm text-gray-600">Phone: {s.phone}</p>
                    {s.email && <p className="text-sm text-gray-600">Email: {s.email}</p>}
                    <p className="text-sm text-gray-600">Role: <span className="font-semibold capitalize">{s.role}</span></p>
                    {s.monthly_salary > 0 && <p className="text-sm text-gray-600">Salary: <span className="font-semibold">₹{s.monthly_salary}</span></p>}
                    {s.joining_date && <p className="text-sm text-gray-600">Joining Date: <span className="font-semibold">{new Date(s.joining_date).toLocaleDateString('en-GB')}</span></p>}
                    {s.salary_eligibility_days && <p className="text-sm text-gray-600">Payment: <span className="font-semibold">{s.salary_eligibility_days} days after joining</span></p>}
                    {s.joining_date && s.salary_eligibility_days && <p className="text-sm text-gray-600">Next Payment Due: <span className="font-semibold">{calculatePaymentDate(s.joining_date, s.salary_eligibility_days)}</span></p>}
                    {s.is_eligible_for_salary !== undefined && <p className="text-sm text-gray-600">Salary Eligible: <span className={`font-semibold ${s.is_eligible_for_salary ? 'text-green-600' : 'text-red-600'}`}>{s.is_eligible_for_salary ? 'Yes' : 'No'}</span></p>}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {s.can_manage_staff && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">Manage Staff</span>}
                      {s.can_view_analytics && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">View Analytics</span>}
                      {s.can_manage_inventory && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">Manage Inventory</span>}
                      {s.can_manage_customers && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Manage Customers</span>}
                    </div>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggleActive(s)} className={`${s.is_active ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-green-500 to-green-600'} text-white px-3 py-1 rounded-lg text-sm hover:shadow-md transition-all flex items-center gap-1`}>
                  {s.is_active ? <><Ban className="w-3 h-3" /> Deactivate</> : <><CheckCircle className="w-3 h-3" /> Activate</>}
                </button>
                <button onClick={() => handleEdit(s)} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:shadow-md transition-all">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, staff: null })}
        onConfirm={confirmToggleActive}
        title={confirmDialog.staff?.is_active ? `Deactivate ${confirmDialog.staff?.name}?` : `Activate ${confirmDialog.staff?.name}?`}
      >
        {confirmDialog.staff?.is_active ? (
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
        ) : (
          <p className="text-gray-600">This staff member will be able to login again.</p>
        )}
      </ConfirmDialog>
    </div>
  );
}
