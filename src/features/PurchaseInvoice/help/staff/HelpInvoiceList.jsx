const HelpInvoiceList = () => ({
  title: 'Invoice List',
  icon: '📋',
  description: 'View and manage all purchase invoices for your shop.',
  sections: [
    {
      heading: 'What you see here',
      points: [
        'All purchase invoices uploaded by you or received from distributors.',
        'Status badge on each invoice: "Staff Verification Required", "Awaiting Admin Approval", "Admin Verified", or "Rejected – Reverify".',
        'Invoice number, date, number of items, net amount, and supplier name.',
      ],
    },
    {
      heading: 'Actions you can take',
      points: [
        'View (👁) — Opens the full invoice details in a read-only popup.',
        'Edit/Verify (✏️) — Opens the invoice editor. Correct any details and submit for admin approval.',
        'Delete (🗑) — Only available for unverified invoices. Deletes the invoice and reverses any stock changes.',
      ],
    },
    {
      heading: 'Status meanings',
      points: [
        '"Staff Verification Required" — You have not yet verified this invoice. Open it, check all details, and click Verify.',
        '"Awaiting Admin Approval" — You have verified. Waiting for admin to approve.',
        '"Admin Verified" — Fully approved. Invoice is locked; contact admin for any changes.',
        '"Rejected – Reverify" — Admin found an issue. Edit the invoice, correct it, and re-submit.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'Search by invoice number or supplier name using the search bar.',
        'Distributor invoices (auto-imported) cannot be deleted — contact the distributor if there is an issue.',
        'Verify invoices promptly so admin can approve and stock is updated correctly.',
      ],
    },
  ],
})

export default HelpInvoiceList
