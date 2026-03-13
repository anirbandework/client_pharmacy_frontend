const HelpUploadInvoice = () => ({
  title: 'Upload Invoice',
  icon: '📤',
  description: 'Upload a supplier invoice (PDF or Excel) or enter it manually. AI extracts all item details automatically.',
  sections: [
    {
      heading: 'Uploading a PDF or Excel file',
      points: [
        '1. Click "Choose File" and select the invoice PDF or Excel file from your device.',
        '2. Click "Upload & Extract" — AI will read the invoice and fill in all item details.',
        '3. Review the extracted data carefully before saving.',
        '4. If extraction is incomplete, click "Force Re-extract" to try again.',
      ],
    },
    {
      heading: 'Manual entry',
      points: [
        'Click "Enter Manually" to open a blank invoice form.',
        'Fill in the supplier name, invoice date, and add items one by one.',
        'The invoice number is auto-generated — you do not need to type it.',
      ],
    },
    {
      heading: 'After upload',
      points: [
        'The invoice is saved with status "Staff Verification Required".',
        'Go to Invoice List, open the invoice, verify all details, and submit for admin approval.',
      ],
    },
    {
      heading: 'Supported file formats',
      points: [
        'PDF — standard pharmacy supplier invoices.',
        'Excel (.xlsx, .xls) — structured spreadsheet invoices.',
        'Maximum file size: 10 MB.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'Scanned PDFs with poor image quality may not extract correctly — use the manual entry option in that case.',
        'Always verify extracted quantities and expiry dates against the physical invoice.',
        'Never upload an invoice that has already been entered — duplicate invoice numbers will be rejected.',
      ],
    },
  ],
})

export default HelpUploadInvoice
