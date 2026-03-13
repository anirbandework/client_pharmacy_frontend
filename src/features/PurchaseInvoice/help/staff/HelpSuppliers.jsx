const HelpSuppliers = () => ({
  title: 'Supplier Performance',
  icon: '🏭',
  description: 'View purchase history and top products for each supplier that has supplied your shop.',
  sections: [
    {
      heading: 'What you see here',
      points: [
        'All suppliers from whom your shop has purchased medicines.',
        'Total purchase value and number of invoices per supplier.',
        'Top products purchased from each supplier.',
      ],
    },
    {
      heading: 'How to use',
      points: [
        'Click on a supplier to expand their details.',
        'Use this to quickly check which supplier stocks a particular medicine.',
        'Share with admin if you notice quality or delivery issues.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'Data only includes verified invoices.',
        'If a supplier is missing, check if their invoices are approved by admin.',
      ],
    },
  ],
})

export default HelpSuppliers
