import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin&superAminApi';
import { ChevronDown, ChevronUp, Info, Ban, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export default function StaffManagement() {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [expandedStaff, setExpandedStaff] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, staff: null });
  const [loading, setLoading] = useState({ submit: false, toggle: null, loadShops: false, loadStaff: false });
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', role: 'staff', staff_code: '', monthly_salary: '',
    joining_date: '', salary_eligibility_days: 4,
    can_manage_staff: false, can_view_analytics: true,
    can_manage_inventory: true, can_manage_customers: true
  });

  useEffect(() => { loadShops(); }, []);
  useEffect(() => { if (selectedShop) loadStaff(); }, [selectedShop]);

  const loadShops = async () => {
    setLoading(prev => ({ ...prev, loadShops: true }));
    try {
      const data = await adminApi.getShops();
      setShops(data);
      if (data.length > 0) setSelectedShop(data[0].shop_code);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(prev => ({ ...prev, loadShops: false }));
    }
  };

  const loadStaff = async () => {
    setLoading(prev => ({ ...prev, loadStaff: true }));
    try {
      const data = await adminApi.getShopStaff(selectedShop);
      setStaff(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(prev => ({ ...prev, loadStaff: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submit: true }));
    try {
      const submitData = { ...formData, role: 'staff' };
      if (editingStaff) {
        await adminApi.updateStaff(editingStaff.id, submitData);
      } else {
        await adminApi.createStaff(selectedShop, submitData);
      }
      setShowForm(false);
      setEditingStaff(null);
      setFormData({ name: '', phone: '', email: '', role: 'staff', staff_code: '', monthly_salary: '', joining_date: '', salary_eligibility_days: 4, can_manage_staff: false, can_view_analytics: true, can_manage_inventory: true, can_manage_customers: true });
      loadStaff();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
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
    setLoading(prev => ({ ...prev, toggle: staff.id }));
    try {
      await adminApi.updateStaff(staff.id, { is_active: !staff.is_active });
      loadStaff();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(prev => ({ ...prev, toggle: null }));
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
        <div className="w-full md:w-auto">
          <label className="block mb-2 text-sm font-semibold text-white">Select Shop:</label>
          <select value={selectedShop || ''} onChange={(e) => setSelectedShop(e.target.value)} className="border-2 border-slate-600 p-2 md:p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full md:w-64 text-sm md:text-base bg-white text-gray-900 transition-all shadow-lg">
            {shops.map(shop => (
              <option key={shop.id} value={shop.shop_code}>{shop.shop_name}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm md:text-base w-full md:w-auto">
          {showForm ? 'Cancel' : '+ Add Staff'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-slate-200 mb-4">
          <h3 className="text-base md:text-lg font-bold mb-4">{editingStaff ? 'Edit Staff' : 'New Staff'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input placeholder="e.g., John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" required />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Staff Code</label>
              <input placeholder="e.g., STAFF001" value={formData.staff_code} onChange={(e) => setFormData({...formData, staff_code: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" required={!editingStaff} disabled={editingStaff} />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input placeholder="e.g., +91 9876543210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" required />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email</label>
              <input placeholder="e.g., staff@example.com" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Monthly Salary</label>
              <input placeholder="e.g., 25000" type="number" value={formData.monthly_salary} onChange={(e) => setFormData({...formData, monthly_salary: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input type="date" value={formData.joining_date} onChange={(e) => setFormData({...formData, joining_date: e.target.value})} max={new Date().toISOString().split('T')[0]} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Payment After Days</label>
              <input type="number" value={formData.salary_eligibility_days} onChange={(e) => setFormData({...formData, salary_eligibility_days: e.target.value})} min="0" placeholder="e.g., 4" className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" />
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs md:text-sm text-blue-700 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Staff will set their own password during first login</span>
          </div>
          <button type="submit" disabled={loading.submit} className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm md:text-base disabled:opacity-50 flex items-center gap-2">
            {loading.submit && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingStaff ? 'Update' : 'Create'} Staff
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {staff.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-xl font-bold text-gray-800">{s.name}</h3>
                  <button onClick={() => toggleExpand(s.id)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    {expandedStaff[s.id] ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Staff Code: <span className="font-semibold">{s.staff_code}</span></p>
                <p className="text-xs md:text-sm text-gray-600">Phone: {s.phone}</p>
                
                {expandedStaff[s.id] && (
                  <>
                    {s.email && <p className="text-xs md:text-sm text-gray-600">Email: {s.email}</p>}
                    <p className="text-xs md:text-sm text-gray-600">Role: <span className="font-semibold capitalize">{s.role}</span></p>
                    {s.monthly_salary > 0 && <p className="text-xs md:text-sm text-gray-600">Salary: <span className="font-semibold">₹{s.monthly_salary}</span></p>}
                    {s.joining_date && <p className="text-xs md:text-sm text-gray-600">Joining Date: <span className="font-semibold">{new Date(s.joining_date).toLocaleDateString('en-GB')}</span></p>}
                    {s.salary_eligibility_days && <p className="text-xs md:text-sm text-gray-600">Payment: <span className="font-semibold">{s.salary_eligibility_days} days after joining</span></p>}
                    {s.joining_date && s.salary_eligibility_days && <p className="text-xs md:text-sm text-gray-600">Next Payment Due: <span className="font-semibold">{calculatePaymentDate(s.joining_date, s.salary_eligibility_days)}</span></p>}
                    {s.is_eligible_for_salary !== undefined && <p className="text-xs md:text-sm text-gray-600">Salary Eligible: <span className={`font-semibold ${s.is_eligible_for_salary ? 'text-green-600' : 'text-red-600'}`}>{s.is_eligible_for_salary ? 'Yes' : 'No'}</span></p>}
                  </>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => handleToggleActive(s)} disabled={loading.toggle === s.id} className={`${s.is_active ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'} text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:shadow-lg transition-all flex items-center gap-1 justify-center flex-1 sm:flex-initial disabled:opacity-50`}>
                  {loading.toggle === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : s.is_active ? <><Ban className="w-3 h-3" /> Deactivate</> : <><CheckCircle className="w-3 h-3" /> Activate</>}
                </button>
                <button onClick={() => handleEdit(s)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:shadow-lg transition-all flex-1 sm:flex-initial">Edit</button>
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
