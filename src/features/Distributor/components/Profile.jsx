import { useState, useEffect } from 'react';
import { User, Building2, Phone, Mail, MapPin, CreditCard, Save, X, Loader2 } from 'lucide-react';
import { distributorApi } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await distributorApi.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await distributorApi.updateProfile(formData);
      await loadProfile();
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6" />
            Profile Information
          </h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company Name
            </label>
            <input
              type="text"
              value={formData.company_name || ''}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contact_person || ''}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address
            </label>
            <textarea
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!editing}
              rows={2}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
            <input
              type="text"
              value={formData.state || ''}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Pincode</label>
            <input
              type="text"
              value={formData.pincode || ''}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">GSTIN</label>
            <input
              type="text"
              value={formData.gstin || ''}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">DL Number</label>
            <input
              type="text"
              value={formData.dl_number || ''}
              onChange={(e) => setFormData({ ...formData, dl_number: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Food License</label>
            <input
              type="text"
              value={formData.food_license || ''}
              onChange={(e) => setFormData({ ...formData, food_license: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Bank Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bank Name</label>
            <input
              type="text"
              value={formData.bank_name || ''}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Account Number</label>
            <input
              type="text"
              value={formData.bank_account || ''}
              onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">IFSC Code</label>
            <input
              type="text"
              value={formData.bank_ifsc || ''}
              onChange={(e) => setFormData({ ...formData, bank_ifsc: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Branch</label>
            <input
              type="text"
              value={formData.bank_branch || ''}
              onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
