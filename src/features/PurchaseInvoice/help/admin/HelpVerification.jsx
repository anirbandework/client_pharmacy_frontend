const HelpVerification = () => ({
  title: 'Invoice Verification',
  icon: '✅',
  description: 'Review, approve, or reject purchase invoices submitted by staff.',
  sections: [
    {
      heading: 'Verification workflow',
      points: [
        '1. Staff uploads/creates an invoice → status: "Staff Verification Required".',
        '2. Staff verifies their own invoice → status: "Awaiting Admin Approval".',
        '3. You (admin) review and Approve or Reject → status: "Admin Verified" or "Rejected – Reverify".',
        'Rejected invoices are sent back to staff for correction.',
      ],
    },
    {
      heading: 'How to approve',
      points: [
        'Click the green tick (✔) button next to an invoice to approve it.',
        'Approving locks the invoice — stock is committed and no further edits are allowed without admin intervention.',
      ],
    },
    {
      heading: 'How to reject',
      points: [
        'Click the red X button to reject an invoice.',
        'Staff will see a pulsing "Rejected – Reverify" badge and can re-edit and re-submit.',
      ],
    },
    {
      heading: 'Editing before approval',
      points: [
        'Click the pencil icon to open the invoice editor.',
        'You can correct item details, quantities, GST, or the invoice number before approving.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'Always check the net amount matches the physical invoice before approving.',
        'GST amounts (CGST + SGST or IGST) should total the GST column on the supplier invoice.',
      ],
    },
  ],
})

export default HelpVerification
