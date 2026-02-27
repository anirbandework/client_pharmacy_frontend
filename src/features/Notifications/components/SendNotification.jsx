import { useState, useEffect } from 'react';
import { notificationsApi } from '../services/notificationsApi';
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi';
import { Send, X } from 'lucide-react';

export default function SendNotification({ onClose, onSuccess }) {
  const [shops, setShops] = useState([]);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    target_type: 'shop',
    shop_ids: [],
    staff_ids: [],
    expires_at: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadShops();
  }, []);

  useEffect(() => {
    if (formData.target_type === 'staff') loadAllStaff();
  }, [formData.target_type]);

  const loadShops = async () => {
    try {
      const data = await adminApi.getShops();
      setShops(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const loadAllStaff = async () => {
    try {
      const allStaff = [];
      for (const shop of shops) {
        const shopStaff = await adminApi.getShopStaff(shop.id);
        allStaff.push(...shopStaff.map(s => ({ ...s, shop_name: shop.shop_name })));
      }
      setStaff(allStaff);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await notificationsApi.sendNotification(formData);
      alert('Notification sent successfully!');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShop = (shopId) => {
    setFormData(prev => ({
      ...prev,
      shop_ids: prev.shop_ids.includes(shopId)
        ? prev.shop_ids.filter(id => id !== shopId)
        : [...prev.shop_ids, shopId]
    }));
  };

  const toggleStaff = (staffId) => {
    setFormData(prev => ({
      ...prev,
      staff_ids: prev.staff_ids.includes(staffId)
        ? prev.staff_ids.filter(id => id !== staffId)
        : [...prev.staff_ids, staffId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Send Notification</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="urgent">Urgent</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target</label>
              <select
                value={formData.target_type}
                onChange={(e) => setFormData({ ...formData, target_type: e.target.value, shop_ids: [], staff_ids: [] })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="shop">Shops</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Expires At (Optional)</label>
            <input
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {formData.target_type === 'shop' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Shops</label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {shops.map(shop => (
                  <label key={shop.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.shop_ids.includes(shop.id)}
                      onChange={() => toggleShop(shop.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{shop.shop_name}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Staff</label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {staff.map(s => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.staff_ids.includes(s.id)}
                      onChange={() => toggleStaff(s.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{s.name} ({s.shop_name})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || (formData.target_type === 'shop' ? formData.shop_ids.length === 0 : formData.staff_ids.length === 0)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
