const HelpExpiryAlerts = () => ({
  title: 'Expiry Alerts',
  icon: '⏰',
  description: 'See which medicines in your shop are expiring soon or have already expired.',
  sections: [
    {
      heading: 'Alert categories',
      points: [
        'Expired — medicines past their expiry date. Remove from shelves immediately.',
        'Expiring within 30 days — take action urgently.',
        'Expiring within 90 days — plan ahead for returns or promotions.',
      ],
    },
    {
      heading: 'How to use',
      points: [
        'The list is filtered to your shop automatically — you only see your own stock.',
        'Sort by expiry date to prioritise the most urgent items.',
        'Note the batch number — this matches the physical stock on the shelf.',
      ],
    },
    {
      heading: 'What to do',
      points: [
        'Expired stock: segregate and report to admin for write-off.',
        'Near-expiry stock: inform admin to arrange supplier return or apply promotional pricing.',
        'Never sell expired medicines.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'This data comes from expiry dates entered during invoice upload — always enter the correct date.',
        'Check this tab at the start of every week.',
      ],
    },
  ],
})

export default HelpExpiryAlerts
