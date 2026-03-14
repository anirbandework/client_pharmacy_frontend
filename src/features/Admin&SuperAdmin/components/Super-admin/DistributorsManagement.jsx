import { useState, useEffect } from 'react';
import { distributorApi } from '../../services/admin&superAminApi';
import { Info, Edit2, Trash2, Ban, CheckCircle, AlertTriangle, Building2, Phone, Mail, MapPin, IndianRupee, Calendar, Package, ChevronDown, ChevronUp, CreditCard, FileText } from 'lucide-react';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export default function DistributorsManagement() {
  const [distributors, setDistributors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, distributor: null });
  const [expandedCards, setExpandedCards] = useState({});
  const [formData, setFormData] = useState({
    company_name: '', distributor_code: '', contact_person: '', phone: ''
  });

  useEffect(() => { 
    loadDistributors();
  }, []);

  const loadDistributors = async () => {
    try {
      const data = await distributorApi.getAllDistributors();
      setDistributors(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDistributor) {
        await distributorApi.updateDistributor(editingDistributor.id, formData);
      } else {
        await distributorApi.createDistributor(formData);
      }
      resetForm();
      loadDistributors();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingDistributor(null);
    setFormData({
      company_name: '', distributor_code: '', contact_person: '', phone: ''
    });
  };

  const handleEdit = (distributor) => {
    setEditingDistributor(distributor);
    setFormData({
      company_name: distributor.company_name,
      distributor_code: distributor.distributor_code,
      contact_person: distributor.contact_person,
      phone: distributor.phone
    });
    setShowForm(true);
  };

  const handleDelete = (distributor) => {
    setConfirmDialog({ isOpen: true, type: 'delete', distributor });
  };

  const handleToggleActive = (distributor) => {
    setConfirmDialog({ isOpen: true, type: distributor.is_active ? 'deactivate' : 'activate', distributor });
  };

  const confirmAction = async () => {
    const { type, distributor } = confirmDialog;
    setConfirmDialog({ isOpen: false, type: null, distributor: null });
    try {
      if (type === 'delete') {
        await distributorApi.deleteDistributor(distributor.id);
      } else {
        await distributorApi.updateDistributor(distributor.id, { is_active: !distributor.is_active });
      }
      loadDistributors();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleCard = (distributorId) => {
    setExpandedCards(prev => ({
      ...prev,
      [distributorId]: !prev[distributorId]
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          {showForm ? 'Cancel' : '+ Create Distributor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-4 border border-primary-100">
          <h3 className="text-lg font-bold mb-4">{editingDistributor ? 'Edit Distributor' : 'Create New Distributor'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              placeholder="Company Name *" 
              value={formData.company_name} 
              onChange={(e) => setFormData({...formData, company_name: e.target.value})} 
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              required 
            />
            <input 
              placeholder="Distributor Code *" 
              value={formData.distributor_code} 
              onChange={(e) => setFormData({...formData, distributor_code: e.target.value})} 
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              required 
              disabled={editingDistributor}
            />
            <input 
              placeholder="Contact Person *" 
              value={formData.contact_person} 
              onChange={(e) => setFormData({...formData, contact_person: e.target.value})} 
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              required 
            />
            <input 
              placeholder="Phone *" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              required 
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-start gap-2 mb-4">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Distributor can complete their profile (email, address, bank details, etc.) after login</span>
          </div>

          <button 
            type="submit" 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {editingDistributor ? 'Update Distributor' : 'Create Distributor'}
          </button>
        </form>
      )}

      {/* Distributors List */}
      <div className="space-y-4">
        {distributors.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center text-gray-500">
            No distributors found
          </div>
        ) : (
          distributors.map(distributor => {
            const isExpanded = expandedCards[distributor.id];
            const hasDetails = distributor.email || distributor.address || distributor.gstin || distributor.bank_name;
            
            return (
            <div key={distributor.id} className="bg-white p-4 rounded-xl shadow-md border border-primary-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-800">{distributor.company_name}</h3>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {distributor.distributor_code}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      distributor.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {distributor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span><strong>Contact:</strong> {distributor.contact_person} ({distributor.phone})</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {hasDetails && (
                    <button
                      onClick={() => toggleCard(distributor.id)}
                      className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all"
                      title={isExpanded ? 'Hide Details' : 'Show Details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                  <button 
                    onClick={() => handleToggleActive(distributor)} 
                    className={`p-2 ${
                      distributor.is_active ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
                    } text-white rounded-lg transition-all`} 
                    title={distributor.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {distributor.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => handleEdit(distributor)} 
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(distributor)} 
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && hasDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  {/* Contact Details */}
                  {distributor.email && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        Contact Information
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                        <p><strong>Email:</strong> {distributor.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Address Details */}
                  {(distributor.address || distributor.city || distributor.state || distributor.pincode) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        Address Details
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 space-y-1">
                        {distributor.address && <p><strong>Address:</strong> {distributor.address}</p>}
                        {(distributor.city || distributor.state || distributor.pincode) && (
                          <p>
                            {distributor.city && <span>{distributor.city}</span>}
                            {distributor.state && <span>{distributor.city ? ', ' : ''}{distributor.state}</span>}
                            {distributor.pincode && <span> - {distributor.pincode}</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Business Details */}
                  {(distributor.gstin || distributor.dl_number || distributor.food_license) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        Business Details
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 space-y-1">
                        {distributor.gstin && <p><strong>GSTIN:</strong> {distributor.gstin}</p>}
                        {distributor.dl_number && <p><strong>DL Number:</strong> {distributor.dl_number}</p>}
                        {distributor.food_license && <p><strong>Food License:</strong> {distributor.food_license}</p>}
                      </div>
                    </div>
                  )}

                  {/* Bank Details */}
                  {(distributor.bank_name || distributor.bank_account || distributor.bank_ifsc || distributor.bank_branch) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        Bank Details
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 space-y-1">
                        {distributor.bank_name && <p><strong>Bank:</strong> {distributor.bank_name}</p>}
                        {distributor.bank_account && <p><strong>Account:</strong> {distributor.bank_account}</p>}
                        {distributor.bank_ifsc && <p><strong>IFSC:</strong> {distributor.bank_ifsc}</p>}
                        {distributor.bank_branch && <p><strong>Branch:</strong> {distributor.bank_branch}</p>}
                      </div>
                    </div>
                  )}

                  {/* Financial Details */}
                  {(distributor.credit_limit || distributor.credit_days) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        Financial Terms
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 space-y-1">
                        {distributor.credit_limit > 0 && <p><strong>Credit Limit:</strong> ₹{distributor.credit_limit}</p>}
                        {distributor.credit_days > 0 && <p><strong>Credit Days:</strong> {distributor.credit_days} days</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Assigned Shops */}
              {distributor.shops && distributor.shops.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Serving Shops ({distributor.shops.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {distributor.shops.map(shop => (
                      <span 
                        key={shop.id} 
                        className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-200"
                      >
                        {shop.shop_name} ({shop.shop_code})
                        {shop.organization_id && <span className="text-purple-500"> - {shop.organization_id}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )})
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: null, distributor: null })}
        onConfirm={confirmAction}
        title={
          confirmDialog.type === 'delete' ? `Delete ${confirmDialog.distributor?.company_name}?` :
          confirmDialog.type === 'deactivate' ? `Deactivate ${confirmDialog.distributor?.company_name}?` :
          `Activate ${confirmDialog.distributor?.company_name}?`
        }
      >
        {confirmDialog.type === 'delete' ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 font-semibold">This action cannot be undone</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-blue-800">Shop assignments will be removed</span>
            </div>
          </>
        ) : confirmDialog.type === 'deactivate' ? (
          <>
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-orange-800">Distributor cannot login</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">All data and shop assignments remain intact</span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">Can be reactivated anytime</span>
            </div>
          </>
        ) : (
          <p className="text-gray-600">This distributor will be able to login again.</p>
        )}
      </ConfirmDialog>
    </div>
  );
}
