const HelpExpiryAlerts = () => ({
  title: 'Expiry Alerts',
  icon: '⏰',
  description: 'Monitor medicines nearing or past their expiry date across all shops.',
  sections: [
    {
      heading: 'Alert categories',
      points: [
        'Expired — medicines whose expiry date has already passed.',
        'Expiring within 30 days — urgent attention required.',
        'Expiring within 90 days — plan returns or promotions.',
      ],
    },
    {
      heading: 'How to use',
      points: [
        'Use the shop filter to view alerts for a specific shop or all shops.',
        'Sort the table by expiry date to prioritise the most urgent items.',
        'Export the list (if available) to share with shop managers.',
      ],
    },
    {
      heading: 'What to do with expiring stock',
      points: [
        'Return to supplier if within the return window.',
        'Apply a discount/promotion to move stock faster.',
        'Write off expired stock and record in your accounting system.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'Data is only as accurate as the expiry dates entered during invoice upload — ensure staff enter correct expiry dates.',
        'Check this tab weekly to avoid write-off losses.',
      ],
    },
  ],
})

export default HelpExpiryAlerts
