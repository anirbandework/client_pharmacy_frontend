const HelpSuppliers = () => ({
  title: 'Supplier Performance',
  icon: '🏭',
  description: "Analyse each supplier's contribution — purchase volume, invoice frequency, and top products.",
  sections: [
    {
      heading: 'What you see here',
      points: [
        'Ranked list of suppliers by total purchase value.',
        'Number of invoices per supplier and average invoice size.',
        'Top products purchased from each supplier.',
        'Month-over-month purchase trend per supplier.',
      ],
    },
    {
      heading: 'How to use',
      points: [
        'Click on a supplier row to expand details.',
        'Use the shop filter to compare supplier usage across locations.',
        'Sort columns by value, invoice count, or name.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'Suppliers with high value but few invoices may offer large bulk discounts — worth negotiating further.',
        'Suppliers with many low-value invoices may be candidates for consolidation.',
        'Cross-reference with Expiry Alerts — a supplier with frequent expiry issues may need quality review.',
      ],
    },
  ],
})

export default HelpSuppliers
