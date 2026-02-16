import { useState, useEffect } from 'react';
import { stockAuditAPI } from '../services/stockAudit';
import { Plus, AlertCircle } from 'lucide-react';

export default function StockAdjustments() {
  const [adjustments, setAdjustments] = useState([]);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    stock_item_id: '',
    adjustment_type: 'correction',
    quantity_change: '',
    reason: '',
    notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [adjustmentsRes, itemsRes] = await Promise.all([
        stockAuditAPI.getAdjustments(),
        stockAuditAPI.getItems()
      ]);
      setAdjustments(adjustmentsRes.data);
      setItems(itemsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await stockAuditAPI.addAdjustment({
        ...formData,
        quantity_change: parseInt(formData.quantity_change)
      });
      setFormData({ stock_item_id: '', adjustment_type: 'correction', quantity_change: '', reason: '', notes: '' });
      setShowForm(false);
      fetchData();
      alert('Adjustment recorded successfully');
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to record adjustment');
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stock Adjustments</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
          <Plus className="w-4 h-4" />Record Adjustment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={formData.stock_item_id} onChange={(e) => setFormData({ ...formData, stock_item_id: e.target.value })} className="px-3 py-2 border rounded" required>
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>{item.item_name} - {item.batch_number}</option>
              ))}
            </select>
            <select value={formData.adjustment_type} onChange={(e) => setFormData({ ...formData, adjustment_type: e.target.value })} className="px-3 py-2 border rounded" required>
              <option value="correction">Correction</option>
              <option value="damage">Damage</option>
              <option value="return">Return</option>
              <option value="expired">Expired</option>
              <option value="theft">Theft</option>
              <option value="found">Found</option>
            </select>
            <input type="number" placeholder="Quantity Change (+ or -)" value={formData.quantity_change} onChange={(e) => setFormData({ ...formData, quantity_change: e.target.value })} className="px-3 py-2 border rounded" required />
            <input type="text" placeholder="Reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="px-3 py-2 border rounded" required />
            <textarea placeholder="Notes (optional)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="px-3 py-2 border rounded md:col-span-2" rows={2} />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {adjustments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No adjustments recorded</p>
        ) : (
          adjustments.map((adj) => (
            <div key={adj.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold">{items.find(i => i.id === adj.stock_item_id)?.item_name || 'Item'}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(adj.adjustment_type)}`}>
                      {adj.adjustment_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Quantity Change: <span className={adj.quantity_change > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{adj.quantity_change > 0 ? '+' : ''}{adj.quantity_change}</span></p>
                  <p className="text-sm text-gray-600">Reason: {adj.reason}</p>
                  {adj.notes && <p className="text-sm text-gray-500">Notes: {adj.notes}</p>}
                  {adj.staff_name && <p className="text-xs text-gray-400 mt-1">By: {adj.staff_name}</p>}
                  <p className="text-xs text-gray-400">{new Date(adj.adjustment_date).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
