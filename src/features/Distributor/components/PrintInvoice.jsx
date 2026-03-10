export default function PrintInvoice({ invoice, onClose }) {
  const dist = invoice.distributor || {};
  const shop = invoice.shop || {};
  const isExternalShop = !invoice.shop_id;
  const shopName = isExternalShop ? invoice.external_shop_name : shop.shop_name;
  const shopPhone = isExternalShop ? invoice.external_shop_phone : shop.phone;
  const shopAddress = isExternalShop ? invoice.external_shop_address : shop.address;
  const shopEmail = isExternalShop ? null : shop.email;
  const shopDL1 = isExternalShop ? invoice.external_shop_license : shop.dl_number_1;
  const shopDL2 = isExternalShop ? null : shop.dl_number_2;
  const shopGST = isExternalShop ? invoice.external_shop_gst : shop.gstin;
  const shopFoodLicense = isExternalShop ? null : shop.food_license;

  // Group items by tax rate
  const taxGroups = {};
  invoice.items.forEach(item => {
    const taxRate = item.cgst_percent + item.sgst_percent + item.igst_percent;
    if (!taxGroups[taxRate]) {
      taxGroups[taxRate] = { qty: 0, amount: 0, discount: 0, taxable: 0, cgst: 0, sgst: 0, igst: 0 };
    }
    taxGroups[taxRate].qty += item.quantity;
    taxGroups[taxRate].amount += item.quantity * item.unit_price;
    taxGroups[taxRate].discount += item.discount_amount;
    taxGroups[taxRate].taxable += item.taxable_amount;
    taxGroups[taxRate].cgst += item.cgst_amount;
    taxGroups[taxRate].sgst += item.sgst_amount;
    taxGroups[taxRate].igst += item.igst_amount;
  });

  const numberToWords = (num) => {
    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    
    if (num === 0) return 'ZERO';
    
    let words = '';
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = Math.floor((num % 1000) / 100);
    const remainder = Math.floor(num % 100);
    
    if (crore > 0) words += ones[crore] + ' CRORE ';
    if (lakh > 0) words += (lakh < 10 ? ones[lakh] : (lakh < 20 ? teens[lakh-10] : tens[Math.floor(lakh/10)] + ' ' + ones[lakh%10])) + ' LAKH ';
    if (thousand > 0) words += (thousand < 10 ? ones[thousand] : (thousand < 20 ? teens[thousand-10] : tens[Math.floor(thousand/10)] + ' ' + ones[thousand%10])) + ' THOUSAND ';
    if (hundred > 0) words += ones[hundred] + ' HUNDRED ';
    if (remainder > 0) {
      if (remainder < 10) words += ones[remainder];
      else if (remainder < 20) words += teens[remainder-10];
      else words += tens[Math.floor(remainder/10)] + ' ' + ones[remainder%10];
    }
    
    return words.trim();
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-invoice, #print-invoice * { visibility: visible; }
          #print-invoice { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        @media screen {
          #print-invoice { max-width: 900px; margin: 20px auto; }
        }
      `}</style>

      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="no-print sticky top-0 bg-gray-100 p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">Invoice Preview</h2>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Print</button>
            <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Close</button>
          </div>
        </div>

        <div id="print-invoice" className="p-4" style={{fontSize: '11px', fontFamily: 'Arial, sans-serif'}}>
          <div style={{border: '2px solid #000', maxWidth: '900px', margin: '0 auto'}}>
            {/* Header */}
            <div style={{textAlign: 'center', borderBottom: '2px solid #000', padding: '10px', background: '#f9f9f9'}}>
              <h1 style={{fontSize: '20px', marginBottom: '3px'}}>SALE INVOICE</h1>
              <h2 style={{fontSize: '16px', margin: '3px 0'}}>{dist.company_name || 'Distributor Company'}</h2>
              <p style={{fontSize: '10px', margin: '1px 0'}}>{dist.address || ''}</p>
              <p style={{fontSize: '10px', margin: '1px 0'}}>{dist.city || ''}, {dist.state || ''} {dist.pincode || ''}</p>
              <p style={{fontSize: '10px', margin: '1px 0'}}>Ph No.: {dist.phone || ''}</p>
              <p style={{fontSize: '10px', margin: '1px 0'}}>DL No.: {dist.dl_number || ''} | Food Lic No.: {dist.food_license || ''}</p>
              <p style={{fontSize: '10px', margin: '1px 0'}}>E-MAIL: {dist.email || ''}</p>
              <p style={{fontSize: '10px', margin: '1px 0'}}>GSTIN No: {dist.gstin || ''}</p>
            </div>

            {/* To Section */}
            <div style={{padding: '10px', borderBottom: '1px solid #000', background: '#f9f9f9'}}>
              <p style={{fontWeight: 'bold'}}>To: {shopName || 'Shop'} {!isExternalShop && shop.shop_code ? `- ${shop.shop_code}` : ''}</p>
              <p>{shopAddress || ''}</p>
              <p>Phone: {shopPhone || ''}{shopEmail ? ` | Email: ${shopEmail}` : ''}</p>
              <p>DL 1: {shopDL1 || ''}{shopDL2 ? ` | DL 2: ${shopDL2}` : ''}</p>
              <p>Food License: {shopFoodLicense || ''} | GST No: {shopGST || ''}</p>
            </div>

            {/* Invoice Details */}
            <div style={{padding: '10px', borderBottom: '1px solid #000'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span><strong>Invoice No:</strong> {invoice.invoice_number}</span>
                <span><strong>Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Items Table */}
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '9px'}}>
              <thead>
                <tr style={{background: '#f5f5f5'}}>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'left'}}>Mfg.</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'left'}}>H.S.N</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'left'}}>Product Name</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'left'}}>Batch</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Qty</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'left'}}>Pkg.</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'left'}}>Expiry</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>MRP</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Rate</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Amount</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>%CGST</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Amt.</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>%SGST</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Amt.</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{border: '1px solid #000', padding: '4px'}}>{item.manufacturer || ''}</td>
                    <td style={{border: '1px solid #000', padding: '4px'}}>{item.hsn_code || ''}</td>
                    <td style={{border: '1px solid #000', padding: '4px'}}>{item.product_name}<br/><small>{item.composition}</small></td>
                    <td style={{border: '1px solid #000', padding: '4px'}}>{item.batch_number}</td>
                    <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{item.quantity}</td>
                    <td style={{border: '1px solid #000', padding: '4px'}}>{item.package || item.unit}</td>
                    <td style={{border: '1px solid #000', padding: '4px'}}>{new Date(item.expiry_date).toLocaleDateString('en-GB', {month: '2-digit', year: 'numeric'})}</td>
                    <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>₹{item.mrp || '-'}</td>
                    <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>₹{item.unit_price.toFixed(2)}</td>
                    <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>₹{item.total_amount.toFixed(2)}</td>
                    <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{item.cgst_percent}</td>
                    <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>₹{item.cgst_amount.toFixed(2)}</td>
                    <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{item.sgst_percent}</td>
                    <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>₹{item.sgst_amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Amount in Words */}
            <div style={{padding: '10px', borderTop: '1px solid #000'}}>
              <p><strong>Rupees: {numberToWords(invoice.net_amount)} ONLY</strong></p>
            </div>

            {/* Tax Summary */}
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '9px', marginTop: '10px'}}>
              <thead>
                <tr style={{background: '#f5f5f5'}}>
                  <th style={{border: '1px solid #000', padding: '4px'}}>Tax %</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Qty</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Total Amount</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Discount</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Taxable</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>Tax Amt</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>CGST Amt</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>SGST Amt</th>
                  <th style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>IGST Amt</th>
                </tr>
              </thead>
              <tbody>
                {[0, 3, 5, 12, 18, 28, 40].map(rate => {
                  const group = taxGroups[rate] || { qty: 0, amount: 0, discount: 0, taxable: 0, cgst: 0, sgst: 0, igst: 0 };
                  return (
                    <tr key={rate}>
                      <td style={{border: '1px solid #000', padding: '4px'}}>{rate} %</td>
                      <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{group.qty.toFixed(0)}</td>
                      <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{group.amount.toFixed(2)}</td>
                      <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{group.discount.toFixed(2)}</td>
                      <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{group.taxable.toFixed(2)}</td>
                      <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{(group.cgst + group.sgst + group.igst).toFixed(2)}</td>
                      <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{group.cgst.toFixed(2)}</td>
                      <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{group.sgst.toFixed(2)}</td>
                      <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{group.igst.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr style={{fontWeight: 'bold'}}>
                  <td style={{border: '1px solid #000', padding: '4px'}}>Total</td>
                  <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{invoice.items.reduce((sum, item) => sum + item.quantity, 0).toFixed(0)}</td>
                  <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{invoice.gross_amount.toFixed(2)}</td>
                  <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{invoice.discount_amount.toFixed(2)}</td>
                  <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{invoice.taxable_amount.toFixed(2)}</td>
                  <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{invoice.total_gst.toFixed(2)}</td>
                  <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{invoice.cgst_amount.toFixed(2)}</td>
                  <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{invoice.sgst_amount.toFixed(2)}</td>
                  <td style={{border: '1px solid #000', padding: '4px', textAlign: 'right'}}>{invoice.igst_amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px', borderTop: '1px solid #000'}}>
              <div>
                <p><strong>Receiver Signature</strong></p>
                <p style={{marginTop: '40px'}}>_____________________</p>
              </div>
              <div style={{fontSize: '10px'}}>
                <p><strong>BANK DETAILS: {dist.company_name || ''}</strong></p>
                <p>Bank Name: {dist.bank_name || ''}</p>
                <p>A/C No.: {dist.bank_account || ''}</p>
                <p>IFSC CODE: {dist.bank_ifsc || ''}</p>
                <p>BRANCH: {dist.bank_branch || ''}</p>
              </div>
              <div>
                <p>Gross Amount: ₹{invoice.gross_amount.toFixed(2)}</p>
                <p>(-) {invoice.discount_amount > 0 ? ((invoice.discount_amount/invoice.gross_amount)*100).toFixed(0) : 0}% Discount: ₹{invoice.discount_amount.toFixed(2)}</p>
                <p>Taxable Amount: ₹{invoice.taxable_amount.toFixed(2)}</p>
                <p>(+) GST Amount: ₹{invoice.total_gst.toFixed(2)}</p>
                <p>(-) Round Off: ₹{invoice.round_off.toFixed(2)}</p>
                <p style={{fontWeight: 'bold', fontSize: '14px', borderTop: '2px solid #000', paddingTop: '8px', marginTop: '8px'}}>Net Amount: ₹{invoice.net_amount.toFixed(2)}</p>
              </div>
            </div>

            <div style={{textAlign: 'right', padding: '10px', borderTop: '1px solid #000'}}>
              <p><strong>For {dist.company_name || 'Distributor Company'}</strong></p>
              <p style={{marginTop: '40px'}}>COMPETENT PERSON SIGNATURE</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
