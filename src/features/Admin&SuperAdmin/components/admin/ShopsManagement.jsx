import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin&superAminApi';
import { Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export default function ShopsManagement() {
  const [shops, setShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
          {showForm ? 'Cancel' : '+ Add Shop'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-4 border border-primary-100">
          <h3 className="text-lg font-bold mb-4">{editingShop ? 'Edit Shop' : 'New Shop'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Shop Name" value={formData.shop_name} onChange={(e) => setFormData({...formData, shop_name: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Shop Code" value={formData.shop_code} onChange={(e) => setFormData({...formData, shop_code: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required={!editingShop} disabled={editingShop} />
            <input placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <input placeholder="License Number" value={formData.license_number} onChange={(e) => setFormData({...formData, license_number: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <input placeholder="GST Number" value={formData.gst_number} onChange={(e) => setFormData({...formData, gst_number: e.target.value})} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <button type="submit" className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
            {editingShop ? 'Update' : 'Create'} Shop
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {shops.map(shop => (
          <div key={shop.id} className="bg-white p-4 rounded-xl shadow-md border border-primary-100 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{shop.shop_name}</h3>
                <p className="text-sm text-gray-500 mb-2">Code: {shop.shop_code}</p>
                <p className="text-sm text-gray-600">{shop.address}</p>
                <p className="text-sm text-gray-600">Phone: {shop.phone}</p>
                {shop.email && <p className="text-sm text-gray-600">Email: {shop.email}</p>}
                {shop.license_number && <p className="text-sm text-gray-600">License: {shop.license_number}</p>}
                {shop.gst_number && <p className="text-sm text-gray-600">GST: {shop.gst_number}</p>}
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${shop.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {shop.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggleActive(shop)} className={`${shop.is_active ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-green-500 to-green-600'} text-white px-3 py-1 rounded-lg text-sm hover:shadow-md transition-all flex items-center gap-1`}>
                  {shop.is_active ? <><Ban className="w-3 h-3" /> Deactivate</> : <><CheckCircle className="w-3 h-3" /> Activate</>}
                </button>
                <button onClick={() => handleEdit(shop)} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:shadow-md transition-all">Edit</button>
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
