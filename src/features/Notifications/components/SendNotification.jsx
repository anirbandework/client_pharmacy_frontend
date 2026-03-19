import { useState, useEffect } from 'react';
import { notificationsApi } from '../services/notificationsApi';
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi';
import { Send, X, Info, AlertTriangle, AlertCircle, Megaphone, Store, Users, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../../contexts/ThemeContext';
import { t } from '../../../theme';

export default function SendNotification({ onClose, onSuccess }) {
  const { isDark } = useTheme();
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
      toast.error(err.message);
    }
  };

  const loadAllStaff = async () => {
    try {
      const allStaff = [];
      for (const shop of shops) {
        const shopStaff = await adminApi.getShopStaff(shop.shop_code);
        allStaff.push(...shopStaff.map(s => ({ ...s, shop_name: shop.shop_name })));
      }
      setStaff(allStaff);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove expires_at if empty
      const payload = { ...formData };
      if (!payload.expires_at) {
        delete payload.expires_at;
      }
      await notificationsApi.sendNotification(payload);
      toast.success('Notification sent successfully!');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Error:', err);
      // Handle API error response
      if (err.response?.data) {
        const errorData = err.response.data;
        // Check for custom error format {error, field, message}
        if (errorData.error || errorData.message) {
          toast.error(errorData.message || errorData.error);
        }
        // Check for FastAPI validation error format
        else if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            const errors = errorData.detail.map(e => `${e.loc[1]}: ${e.msg}`).join(', ');
            toast.error(errors);
          } else {
            toast.error(errorData.detail);
          }
        } else {
          toast.error('Failed to send notification');
        }
      } else {
        toast.error(err.message || 'Failed to send notification');
      }
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div style={t.glassCard(isDark)} className="rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Send Notification</h2>
                <p className="text-blue-100 text-sm">Broadcast message to shops or staff</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Title */}
          <div>
            <label style={{ color: t.text.primary(isDark) }} className="block text-sm font-bold mb-2">Title *</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notification title"
              maxLength={200}
              style={t.input(isDark)}
              className="w-full p-3 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p style={{ color: t.text.muted(isDark) }} className="text-xs mt-1">{formData.title.length}/200 characters</p>
          </div>

          {/* Message */}
          <div>
            <label style={{ color: t.text.primary(isDark) }} className="block text-sm font-bold mb-2">Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your message here..."
              rows={4}
              style={t.input(isDark)}
              className="w-full p-3 rounded-xl transition-colors outline-none resize-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Type & Target */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ color: t.text.primary(isDark) }} className="block text-sm font-bold mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={t.input(isDark)}
                className="w-full p-3 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="urgent">Urgent</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>

            <div>
              <label style={{ color: t.text.primary(isDark) }} className="block text-sm font-bold mb-2">Target *</label>
              <select
                value={formData.target_type}
                onChange={(e) => setFormData({ ...formData, target_type: e.target.value, shop_ids: [], staff_ids: [] })}
                style={t.input(isDark)}
                className="w-full p-3 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="shop">Shops</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>

          {/* Expires At */}
          <div>
            <label style={{ color: t.text.primary(isDark) }} className="block text-sm font-bold mb-2">Expires At (Optional)</label>
            <input
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              style={t.input(isDark)}
              className="w-full p-3 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p style={{ color: t.text.muted(isDark) }} className="text-xs mt-1">Leave empty for no expiration</p>
          </div>

          {/* Select Shops/Staff */}
          {formData.target_type === 'shop' ? (
            <div>
              <label style={{ color: t.text.primary(isDark) }} className="block text-sm font-bold mb-2">
                Select Shops * ({formData.shop_ids.length} selected)
              </label>
              <div style={{ ...t.innerRow(isDark), borderColor: t.divider(isDark) }} className="rounded-xl p-4 max-h-64 overflow-y-auto">
                {shops.length === 0 ? (
                  <p style={{ color: t.text.secondary(isDark) }} className="text-center py-4">No shops available</p>
                ) : (
                  <div className="space-y-2">
                    {shops.map(shop => (
                      <label key={shop.id} style={t.innerRow(isDark)} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors group">
                        <input
                          type="checkbox"
                          checked={formData.shop_ids.includes(shop.id)}
                          onChange={() => toggleShop(shop.id)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span style={{ color: t.text.primary(isDark) }} className="text-sm font-medium group-hover:text-blue-600">{shop.shop_name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label style={{ color: t.text.primary(isDark) }} className="block text-sm font-bold mb-2">
                Select Staff * ({formData.staff_ids.length} selected)
              </label>
              <div style={{ ...t.innerRow(isDark), borderColor: t.divider(isDark) }} className="rounded-xl p-4 max-h-64 overflow-y-auto">
                {staff.length === 0 ? (
                  <p style={{ color: t.text.secondary(isDark) }} className="text-center py-4">No staff available</p>
                ) : (
                  <div className="space-y-2">
                    {staff.map(s => (
                      <label key={s.id} style={t.innerRow(isDark)} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors group">
                        <input
                          type="checkbox"
                          checked={formData.staff_ids.includes(s.id)}
                          onChange={() => toggleStaff(s.id)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span style={{ color: t.text.primary(isDark) }} className="text-sm font-medium group-hover:text-blue-600">{s.name}</span>
                          <span style={{ color: t.text.muted(isDark) }} className="text-xs ml-2">({s.shop_name})</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ borderColor: t.divider(isDark) }} className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || (formData.target_type === 'shop' ? formData.shop_ids.length === 0 : formData.staff_ids.length === 0)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ borderColor: t.divider(isDark), color: t.text.primary(isDark) }}
              className="px-6 py-3.5 border-2 rounded-xl font-bold hover:opacity-70 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
