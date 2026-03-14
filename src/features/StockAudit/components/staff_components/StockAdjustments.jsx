import { useState, useEffect } from 'react';
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis';
import { Plus, AlertCircle, Download, Search } from 'lucide-react';
import Pagination from '../shared/Pagination';

const PER_PAGE = 20;

export default function StockAdjustments() {
  const [adjustments, setAdjustments] = useState([]);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    stock_item_id: '',
    adjustment_type: 'correction',
    quantity_change: '',
    reason: '',
    notes: ''
  });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => { fetchData(page); }, [page]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = items.filter(item => 
        item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.composition?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowDropdown(true);
    } else {
      setFilteredItems([]);
      setShowDropdown(false);
    }
  }, [searchTerm, items]);

  const fetchData = async (p = 1) => {
    try {
      const [adjustmentsRes, itemsRes] = await Promise.all([
        staffStockAuditAPI.getAdjustments({ page: p, per_page: PER_PAGE }),
        staffStockAuditAPI.getItems({ page: 1, per_page: 500 })
      ]);
      setAdjustments(adjustmentsRes.data.items);
      setTotal(adjustmentsRes.data.total);
      setTotalPages(adjustmentsRes.data.pages);
      setItems(itemsRes.data.items);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setFormData({ ...formData, stock_item_id: item.id });
    setSearchTerm(`${item.product_name}${item.composition ? ' - ' + item.composition : ''}`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffStockAuditAPI.addAdjustment({
        ...formData,
        quantity_change: parseInt(formData.quantity_change)
      });
      setFormData({ stock_item_id: '', adjustment_type: 'correction', quantity_change: '', reason: '', notes: '' });
      setSelectedItem(null);
      setSearchTerm('');
      setShowForm(false);
      setPage(1);
      fetchData(1);
      alert('Adjustment recorded successfully');
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to record adjustment');
    }
  };

  const handleExport = async () => {
    try {
      const response = await staffStockAuditAPI.exportAdjustments({ days: 30 });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `adjustments_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export adjustments');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      correction: 'bg-blue-100 text-blue-700',
      damage: 'bg-red-100 text-red-700',
      return: 'bg-green-100 text-green-700',
      expired: 'bg-orange-100 text-orange-700',
      theft: 'bg-purple-100 text-purple-700',
      found: 'bg-teal-100 text-teal-700'
    };
    return colors[type] || colors.correction;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-pink-600" />
          Stock Adjustments
        </h2>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all text-sm md:text-base">
            <Download className="w-4 h-4" />Export Excel
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm md:text-base">
            <Plus className="w-4 h-4" />Record Adjustment
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by product name or composition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm && setShowDropdown(true)}
                  className="w-full pl-10 pr-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required={!formData.stock_item_id}
                />
              </div>
              {showDropdown && filteredItems.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-pink-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className="px-4 py-2 hover:bg-pink-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-semibold text-gray-800">{item.product_name}</div>
                      {item.composition && <div className="text-sm text-gray-600">{item.composition}</div>}
                      <div className="text-xs text-gray-500">Batch: {item.batch_number} | Stock: {item.quantity_software}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedItem && (
              <div className="md:col-span-2 p-3 bg-white border-2 border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">Current Stock: <span className="text-green-600 text-lg">{selectedItem.quantity_software}</span></p>
              </div>
            )}
            <select value={formData.adjustment_type} onChange={(e) => setFormData({ ...formData, adjustment_type: e.target.value })} className="px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" required>
              <option value="correction">Correction</option>
              <option value="damage">Damage</option>
              <option value="return">Return</option>
              <option value="expired">Expired</option>
              <option value="theft">Theft</option>
              <option value="found">Found</option>
            </select>
            <input type="number" placeholder="Quantity Change (+ or -)" value={formData.quantity_change} onChange={(e) => setFormData({ ...formData, quantity_change: e.target.value })} className="px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" required />
            <input type="text" placeholder="Reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" required />
            <textarea placeholder="Notes (optional)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 md:col-span-2" rows={2} />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {adjustments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <AlertCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-sm md:text-base">No adjustments recorded</p>
          </div>
        ) : (
          adjustments.map((adj) => (
            <div key={adj.id} className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                    <h4 className="font-bold text-gray-800">{items.find(i => i.id === adj.stock_item_id)?.product_name || 'Item'}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(adj.adjustment_type)}`}>
                      {adj.adjustment_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Quantity Change: <span className={adj.quantity_change > 0 ? 'text-green-600 font-bold text-base' : 'text-red-600 font-bold text-base'}>{adj.quantity_change > 0 ? '+' : ''}{adj.quantity_change}</span></p>
                  <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Reason:</span> {adj.reason}</p>
                  {adj.notes && <p className="text-sm text-gray-500 mb-1"><span className="font-medium">Notes:</span> {adj.notes}</p>}
                  {adj.staff_name && <p className="text-xs text-gray-400 mt-2">By: {adj.staff_name}</p>}
                  <p className="text-xs text-gray-400">{new Date(adj.adjustment_date).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        perPage={PER_PAGE}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
