import { useState } from 'react';
import { Search, FileText, Building2, Phone, Mail, FileCheck, Plus, Loader2 } from 'lucide-react';
import { distributorApi } from '../services/api';

export default function ShopSearch({ setSelectedShopForInvoice, setShowCreateInvoice }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState({});

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await distributorApi.searchShops(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleCreateInvoiceForShop = (shop) => {
    setCreatingInvoice(prev => ({ ...prev, [shop.id]: true }));
    setSelectedShopForInvoice(shop);
    setShowCreateInvoice(true);
    // Reset loading state after a short delay
    setTimeout(() => setCreatingInvoice(prev => ({ ...prev, [shop.id]: false })), 500);
  };

  const handleCreateInvoiceForNew = () => {
    setCreatingInvoice(prev => ({ ...prev, 'new': true }));
    setSelectedShopForInvoice({ is_registered: false });
    setShowCreateInvoice(true);
    // Reset loading state after a short delay
    setTimeout(() => setCreatingInvoice(prev => ({ ...prev, 'new': false })), 500);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by shop name, phone, DL number, or GST number..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            autoFocus
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Enter at least 2 characters to search for registered shops
        </p>
      </div>

      {/* Search Results */}
      {searchQuery.length >= 2 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {searching ? 'Searching...' : `Search Results (${searchResults.length})`}
          </h3>

          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((shop) => (
                <div
                  key={shop.id}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-800">{shop.shop_name}</h4>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          Registered
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {shop.shop_code && <p><strong>Code:</strong> {shop.shop_code}</p>}
                        {shop.phone && (
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {shop.phone}
                          </p>
                        )}
                        {shop.license_number && (
                          <p className="flex items-center gap-1">
                            <FileCheck className="w-3 h-3" />
                            DL: {shop.license_number}
                          </p>
                        )}
                        {shop.gst_number && (
                          <p className="flex items-center gap-1">
                            <FileCheck className="w-3 h-3" />
                            GST: {shop.gst_number}
                          </p>
                        )}
                      </div>
                      {shop.address && (
                        <p className="text-xs text-gray-500 mt-2">{shop.address}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleCreateInvoiceForShop(shop)}
                      disabled={creatingInvoice[shop.id]}
                      className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {creatingInvoice[shop.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                      {creatingInvoice[shop.id] ? 'Opening...' : 'Create Invoice'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : !searching && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">No registered shops found</p>
              <button
                onClick={handleCreateInvoiceForNew}
                disabled={creatingInvoice['new']}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {creatingInvoice['new'] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                {creatingInvoice['new'] ? 'Opening...' : 'Create Invoice for New Shop'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Action */}
      {searchQuery.length === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Search for Shops</h3>
          <p className="text-gray-600 mb-6">
            Search for registered shops or create invoices for new shops
          </p>
          <button
            onClick={handleCreateInvoiceForNew}
            disabled={creatingInvoice['new']}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {creatingInvoice['new'] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {creatingInvoice['new'] ? 'Opening...' : 'Create Invoice for New Shop'}
          </button>
        </div>
      )}
    </div>
  );
}
