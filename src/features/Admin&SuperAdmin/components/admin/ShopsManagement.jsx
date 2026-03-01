import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin&superAminApi';
import { Ban, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export default function ShopsManagement({ isDark = false }) {
  const [shops, setShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [expandedShops, setExpandedShops] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, shop: null });
  const [formData, setFormData] = useState({
    shop_name: '', shop_code: '', address: '', phone: '', email: '',
    license_number: '', gst_number: ''
  });

  useEffect(() => { loadShops(); }, []);

  const loadShops = async () => {
    try {
      const data = await adminApi.getShops();
      setShops(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingShop) {
        await adminApi.updateShop(editingShop.id, formData);
      } else {
        await adminApi.createShop(formData);
      }
      setShowForm(false);
      setEditingShop(null);
      setFormData({ shop_name: '', shop_code: '', address: '', phone: '', email: '', license_number: '', gst_number: '' });
      loadShops();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (shop) => {
    setEditingShop(shop);
    setFormData({ shop_name: shop.shop_name, shop_code: shop.shop_code, address: shop.address, phone: shop.phone, email: shop.email, license_number: shop.license_number, gst_number: shop.gst_number });
    setShowForm(true);
  };

  const handleToggleActive = (shop) => {
    setConfirmDialog({ isOpen: true, shop });
  };

  const confirmToggleActive = async () => {
    const shop = confirmDialog.shop;
    setConfirmDialog({ isOpen: false, shop: null });
    try {
      await adminApi.updateShop(shop.id, { is_active: !shop.is_active });
      loadShops();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleExpand = (shopId) => {
    setExpandedShops(prev => ({ ...prev, [shopId]: !prev[shopId] }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm md:text-base">
          {showForm ? 'Cancel' : '+ Add Shop'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-slate-200 mb-4">
          <h3 className="text-base md:text-lg font-bold mb-4">{editingShop ? 'Edit Shop' : 'New Shop'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Shop Name</label>
              <input placeholder="e.g., Main Street Pharmacy" value={formData.shop_name} onChange={(e) => setFormData({...formData, shop_name: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" required />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Shop Code</label>
              <input placeholder="e.g., SHOP001" value={formData.shop_code} onChange={(e) => setFormData({...formData, shop_code: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" required={!editingShop} disabled={editingShop} />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Address</label>
              <input placeholder="e.g., 123 Main St, City" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" required />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input placeholder="e.g., +91 9876543210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" required />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email</label>
              <input placeholder="e.g., shop@example.com" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input placeholder="e.g., DL-12345" value={formData.license_number} onChange={(e) => setFormData({...formData, license_number: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">GST Number</label>
              <input placeholder="e.g., 22AAAAA0000A1Z5" value={formData.gst_number} onChange={(e) => setFormData({...formData, gst_number: e.target.value})} className="border-2 border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full text-sm md:text-base transition-all" />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm md:text-base">
            {editingShop ? 'Update' : 'Create'} Shop
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {shops.map(shop => (
          <div key={shop.id} className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-xl font-bold text-gray-800">{shop.shop_name}</h3>
                  <button onClick={() => toggleExpand(shop.id)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    {expandedShops[shop.id] ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Code: <span className="font-semibold">{shop.shop_code}</span></p>
                <p className="text-xs md:text-sm text-gray-600">Phone: {shop.phone}</p>
                
                {expandedShops[shop.id] && (
                  <>
                    <p className="text-xs md:text-sm text-gray-600">{shop.address}</p>
                    {shop.email && <p className="text-xs md:text-sm text-gray-600">Email: {shop.email}</p>}
                    {shop.license_number && <p className="text-xs md:text-sm text-gray-600">License: {shop.license_number}</p>}
                    {shop.gst_number && <p className="text-xs md:text-sm text-gray-600">GST: {shop.gst_number}</p>}
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold ${shop.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {shop.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => handleToggleActive(shop)} className={`${shop.is_active ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'} text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:shadow-lg transition-all flex items-center gap-1 justify-center flex-1 sm:flex-initial`}>
                  {shop.is_active ? <><Ban className="w-3 h-3" /> Deactivate</> : <><CheckCircle className="w-3 h-3" /> Activate</>}
                </button>
                <button onClick={() => handleEdit(shop)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm hover:shadow-lg transition-all flex-1 sm:flex-initial">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, shop: null })}
        onConfirm={confirmToggleActive}
        title={confirmDialog.shop?.is_active ? `Deactivate ${confirmDialog.shop?.shop_name}?` : `Activate ${confirmDialog.shop?.shop_name}?`}
      >
        {confirmDialog.shop?.is_active ? (
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
        ) : (
          <p className="text-gray-600">This shop and all its staff will be able to login again.</p>
        )}
      </ConfirmDialog>
    </div>
  );
}
