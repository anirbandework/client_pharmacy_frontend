import { useState } from 'react';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { distributorApi } from '../services/api';
import toast from 'react-hot-toast';

export default function CreateInvoice({ shop, onClose, onSuccess }) {
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [externalShop, setExternalShop] = useState({
    name: '', phone: '', address: '', license: '', gst: '', food_license: ''
  });
  const [items, setItems] = useState([{
    composition: '', product_name: '', batch_number: '', quantity: 0, unit: '',
    manufacturing_date: '', expiry_date: '', unit_price: 0, selling_price: 0,
    manufacturer: '', hsn_code: '', free_quantity: 0, package: '', mrp: '',
    profit_margin: 0, discount_on_purchase: 0, discount_on_sales: 0, discount_percent: 0, discount_amount: 0, before_discount: 0,
    cgst_percent: 0, sgst_percent: 0, igst_percent: 0
  }]);
  const [saving, setSaving] = useState(false);

  const addItem = () => setItems([...items, {
    composition: '', product_name: '', batch_number: '', quantity: 0, unit: '',
    manufacturing_date: '', expiry_date: '', unit_price: 0, selling_price: 0,
    manufacturer: '', hsn_code: '', free_quantity: 0, package: '', mrp: '',
    profit_margin: 0, discount_on_purchase: 0, discount_on_sales: 0, discount_percent: 0, discount_amount: 0, before_discount: 0,
    cgst_percent: 0, sgst_percent: 0, igst_percent: 0
  }]);

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    
    if (['quantity', 'unit_price', 'free_quantity', 'discount_on_purchase', 'discount_on_sales', 'discount_percent', 'cgst_percent', 'sgst_percent', 'igst_percent'].includes(field)) {
      const item = updated[index];
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      const discPct = parseFloat(item.discount_percent) || 0;
      
      const beforeDisc = qty * price;
      const discAmt = beforeDisc * (discPct / 100);
      const taxable = beforeDisc - discAmt;
      
      const cgstPct = parseFloat(item.cgst_percent) || 0;
      const sgstPct = parseFloat(item.sgst_percent) || 0;
      const igstPct = parseFloat(item.igst_percent) || 0;
      
      item.before_discount = beforeDisc;
      item.discount_amount = discAmt;
      item.taxable_amount = taxable;
      item.cgst_amount = taxable * (cgstPct / 100);
      item.sgst_amount = taxable * (sgstPct / 100);
      item.igst_amount = taxable * (igstPct / 100);
      item.total_amount = taxable + item.cgst_amount + item.sgst_amount + item.igst_amount;
      item.selling_price = price;
    }
    
    setItems(updated);
  };

  const calculateTotals = () => {
    const gross = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const discount = items.reduce((sum, item) => sum + (item.discount_amount || 0), 0);
    const taxable = gross - discount;
    const cgst = items.reduce((sum, item) => sum + (item.cgst_amount || 0), 0);
    const sgst = items.reduce((sum, item) => sum + (item.sgst_amount || 0), 0);
    const igst = items.reduce((sum, item) => sum + (item.igst_amount || 0), 0);
    const totalGst = cgst + sgst + igst;
    const net = taxable + totalGst;
    
    return { gross, discount, taxable, cgst, sgst, igst, totalGst, net };
  };

  const handleSubmit = async () => {
    const totals = calculateTotals();
    setSaving(true);
    
    try {
      await distributorApi.createInvoice({
        shop_id: shop.id || null,
        external_shop_name: shop.is_registered === false ? externalShop.name : null,
        external_shop_phone: shop.is_registered === false ? externalShop.phone : null,
        external_shop_address: shop.is_registered === false ? externalShop.address : null,
        external_shop_license: shop.is_registered === false ? externalShop.license : null,
        external_shop_gst: shop.is_registered === false ? externalShop.gst : null,
        external_shop_food_license: shop.is_registered === false ? externalShop.food_license : null,
        invoice_date: invoiceDate,
        due_date: dueDate || null,
        gross_amount: totals.gross,
        discount_amount: totals.discount,
        taxable_amount: totals.taxable,
        cgst_amount: totals.cgst,
        sgst_amount: totals.sgst,
        igst_amount: totals.igst,
        total_gst: totals.totalGst,
        round_off: 0,
        net_amount: totals.net,
        items
      });
      
      toast.success('Invoice created successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.log('Error details:', error);
      const errorData = error.response?.data;
      
      if (errorData?.detail) {
        if (Array.isArray(errorData.detail)) {
          // Pydantic validation errors
          errorData.detail.forEach(err => {
            const field = err.loc ? err.loc[err.loc.length - 1] : '';
            const msg = err.msg || 'Validation error';
            toast.error(field ? `${field}: ${msg}` : msg);
          });
        } else if (typeof errorData.detail === 'string') {
          toast.error(errorData.detail);
        } else {
          toast.error('Validation failed. Please check all required fields.');
        }
      } else {
        toast.error(error.message || 'Failed to create invoice');
      }
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Create Invoice for {shop.shop_name || 'New Shop'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {shop.is_registered === false && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-blue-900">External Shop Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Shop Name*</label>
                  <input placeholder="Shop name" value={externalShop.name} onChange={(e) => setExternalShop({...externalShop, name: e.target.value})} className="border rounded px-3 py-2 text-sm w-full" required />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Phone*</label>
                  <input placeholder="Phone number" value={externalShop.phone} onChange={(e) => setExternalShop({...externalShop, phone: e.target.value})} className="border rounded px-3 py-2 text-sm w-full" required />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Address</label>
                  <input placeholder="Address" value={externalShop.address} onChange={(e) => setExternalShop({...externalShop, address: e.target.value})} className="border rounded px-3 py-2 text-sm w-full" />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">DL Number</label>
                  <input placeholder="Drug license" value={externalShop.license} onChange={(e) => setExternalShop({...externalShop, license: e.target.value})} className="border rounded px-3 py-2 text-sm w-full" />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Food License</label>
                  <input placeholder="Food license" value={externalShop.food_license} onChange={(e) => setExternalShop({...externalShop, food_license: e.target.value})} className="border rounded px-3 py-2 text-sm w-full" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-600 mb-1 block">GST Number</label>
                  <input placeholder="GST number" value={externalShop.gst} onChange={(e) => setExternalShop({...externalShop, gst: e.target.value})} className="border rounded px-3 py-2 text-sm w-full" />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Invoice Date*</label>
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="border rounded-lg px-3 py-2 w-full" required />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border rounded-lg px-3 py-2 w-full" />
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Item {index + 1}</span>
                  {items.length > 1 && <button onClick={() => removeItem(index)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Composition</label>
                    <input placeholder="e.g. Paracetamol 500mg" value={item.composition} onChange={(e) => updateItem(index, 'composition', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Product Name*</label>
                    <input placeholder="e.g. Dolo 650" value={item.product_name} onChange={(e) => updateItem(index, 'product_name', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Batch*</label>
                    <input placeholder="e.g. BT12345" value={item.batch_number} onChange={(e) => updateItem(index, 'batch_number', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Manufacturer</label>
                    <input placeholder="e.g. Cipla Ltd" value={item.manufacturer} onChange={(e) => updateItem(index, 'manufacturer', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Quantity*</label>
                    <input type="number" placeholder="e.g. 100" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Free Qty</label>
                    <input type="number" placeholder="e.g. 10" value={item.free_quantity} onChange={(e) => updateItem(index, 'free_quantity', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Unit*</label>
                    <input placeholder="e.g. Tablets" value={item.unit} onChange={(e) => updateItem(index, 'unit', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Package</label>
                    <input placeholder="e.g. 10x10" value={item.package} onChange={(e) => updateItem(index, 'package', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Mfg Date</label>
                    <input type="date" value={item.manufacturing_date} onChange={(e) => updateItem(index, 'manufacturing_date', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Exp Date*</label>
                    <input type="date" value={item.expiry_date} onChange={(e) => updateItem(index, 'expiry_date', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">MRP*</label>
                    <input placeholder="e.g. 100.00" value={item.mrp} onChange={(e) => updateItem(index, 'mrp', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">HSN Code*</label>
                    <input placeholder="e.g. 30049099" value={item.hsn_code} onChange={(e) => updateItem(index, 'hsn_code', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" required />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Rate*</label>
                    <input type="number" step="0.01" placeholder="e.g. 50.00" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Discount %</label>
                    <input type="number" step="0.01" placeholder="e.g. 5" value={item.discount_percent} onChange={(e) => updateItem(index, 'discount_percent', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">CGST %</label>
                    <input type="number" step="0.01" placeholder="e.g. 6" value={item.cgst_percent} onChange={(e) => updateItem(index, 'cgst_percent', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">SGST %</label>
                    <input type="number" step="0.01" placeholder="e.g. 6" value={item.sgst_percent} onChange={(e) => updateItem(index, 'sgst_percent', e.target.value)} className="border rounded px-2 py-1 text-sm w-full" />
                  </div>
                  
                  <div className="col-span-4 text-right text-sm text-gray-600">
                    Amount: ₹{item.total_amount?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addItem} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <Plus className="w-4 h-4" /> Add Item
          </button>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between"><span>Gross Amount:</span><span>₹{totals.gross.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Discount:</span><span>₹{totals.discount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Taxable:</span><span>₹{totals.taxable.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Total GST:</span><span>₹{totals.totalGst.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Net Amount:</span><span>₹{totals.net.toFixed(2)}</span></div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={saving} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Create Invoice'}
            </button>
            <button onClick={onClose} className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
