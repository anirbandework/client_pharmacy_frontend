const HelpDashboard = () => ({
  title: 'Dashboard',
  icon: '📊',
  description: 'A summary of purchase activity and key stats for your shop.',
  sections: [
    {
      heading: 'What you see here',
      points: [
        'Total invoices uploaded and their approval status breakdown.',
        'Monthly purchase spend trend for your shop.',
        'Most frequently purchased medicines.',
        'Pending verifications requiring your action.',
      ],
    },
    {
      heading: 'How to use',
      points: [
        'Use this as your daily check-in — see what is pending and what has been approved.',
        'The spend trend helps you gauge if you are within budget for the month.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'If the pending count is high, go to Invoice List and verify outstanding invoices.',
        'Dashboard data updates automatically each time you open the tab.',
      ],
    },
  ],
})

export default HelpDashboard
