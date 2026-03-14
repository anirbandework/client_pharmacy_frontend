import { useState, useEffect } from 'react'
import { Settings, Save, Edit2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { billingAdminAPI } from '../../services/admin_billing_apis'

const emptyConfig = {
  storeName: '',
  logo: '',
  dlNumbers: { dl20: '', dl21: '' },
  flNumber: '',
  address: { line1: '', state: '', pincode: '' },
  phone: '',
  gstIn: ''
}

const AdminBillConfigManager = ({ selectedShop = null }) => {
  const [config, setConfig] = useState(emptyConfig)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [hasConfig, setHasConfig] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)

  useEffect(() => {
    if (selectedShop) fetchConfig(selectedShop)
    else {
      setConfig(emptyConfig)
      setHasConfig(false)
      setIsEditing(false)
      setLogoPreview(null)
    }
  }, [selectedShop])

  const fetchConfig = async (shopId) => {
    setFetching(true)
    try {
      const { data } = await billingAdminAPI.getShopBillConfig(shopId)
      if (data.config) {
        setConfig(data.config)
        setLogoPreview(data.config.logo)
        setHasConfig(true)
        setIsEditing(false)
      } else {
        setConfig(emptyConfig)
        setHasConfig(false)
        setIsEditing(true)
      }
    } catch {
      toast.error('Failed to load config')
      setIsEditing(true)
    } finally {
      setFetching(false)
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
        setConfig(c => ({ ...c, logo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await billingAdminAPI.updateShopBillConfig(selectedShop, config)
      toast.success('Bill configuration updated successfully')
      setHasConfig(true)
      setIsEditing(false)
    } catch {
      toast.error('Failed to update configuration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {!selectedShop && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Select a shop from the dropdown above to view or edit its bill configuration.
        </div>
      )}

      {selectedShop && fetching && (
        <div className="text-center py-10 text-gray-500">Loading config...</div>
      )}

      {selectedShop && !fetching && !isEditing && hasConfig && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold">Bill Format Configuration</h2>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="space-y-4">
            {logoPreview && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Logo</p>
                <img src={logoPreview} alt="Logo" className="w-24 h-24 object-contain border rounded" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Store Name</p>
                <p className="font-semibold">{config.storeName}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-semibold">{config.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">DL Number 20</p>
                <p className="font-semibold">{config.dlNumbers?.dl20 || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">DL Number 21</p>
                <p className="font-semibold">{config.dlNumbers?.dl21 || '-'}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">FL Number</p>
              <p className="font-semibold">{config.flNumber || '-'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="font-semibold">{config.address?.line1}</p>
              <p className="font-semibold">{config.address?.state}, {config.address?.pincode}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">GST IN</p>
              <p className="font-semibold">{config.gstIn}</p>
            </div>
          </div>
        </div>
      )}

      {selectedShop && !fetching && isEditing && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">Bill Format Configuration</h2>
            {hasConfig && (
              <button onClick={() => setIsEditing(false)} className="ml-auto text-sm text-gray-500 hover:text-gray-700">
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Store Logo</label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" className="w-20 h-20 object-contain border rounded" />
                )}
                <label className="cursor-pointer px-4 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Store Name</label>
              <input
                type="text"
                value={config.storeName}
                onChange={(e) => setConfig(c => ({ ...c, storeName: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">DL Number 20</label>
                <input
                  type="text"
                  value={config.dlNumbers?.dl20 || ''}
                  onChange={(e) => setConfig(c => ({ ...c, dlNumbers: { ...c.dlNumbers, dl20: e.target.value } }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">DL Number 21</label>
                <input
                  type="text"
                  value={config.dlNumbers?.dl21 || ''}
                  onChange={(e) => setConfig(c => ({ ...c, dlNumbers: { ...c.dlNumbers, dl21: e.target.value } }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">FL Number</label>
              <input
                type="text"
                value={config.flNumber || ''}
                onChange={(e) => setConfig(c => ({ ...c, flNumber: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address Line 1</label>
              <input
                type="text"
                value={config.address?.line1 || ''}
                onChange={(e) => setConfig(c => ({ ...c, address: { ...c.address, line1: e.target.value } }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={config.address?.state || ''}
                  onChange={(e) => setConfig(c => ({ ...c, address: { ...c.address, state: e.target.value } }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pincode</label>
                <input
                  type="text"
                  value={config.address?.pincode || ''}
                  onChange={(e) => setConfig(c => ({ ...c, address: { ...c.address, pincode: e.target.value } }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  value={config.phone || ''}
                  onChange={(e) => setConfig(c => ({ ...c, phone: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GST IN</label>
                <input
                  type="text"
                  value={config.gstIn || ''}
                  onChange={(e) => setConfig(c => ({ ...c, gstIn: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Configuration'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminBillConfigManager
