import { BarChart3 } from 'lucide-react'

const HelpDashboard = () => ({
  title: 'Dashboard',
  icon: <BarChart3 className="w-5 h-5" />,
  description: 'Overview of all purchase invoice analytics across your organisation.',
  sections: [
    {
      heading: 'What you see here',
      points: [
        'Key metrics: total invoices, total spend, verified vs. pending counts.',
        'Spend trend chart — monthly purchase cost over time.',
        'Top suppliers by purchase value.',
        'Category-wise spend breakdown.',
      ],
    },
    {
      heading: 'How to use',
      points: [
        'Use the shop filter (top-right) to narrow data to a specific shop or view all shops in your organisation.',
        'Hover over chart bars or pie slices for exact figures.',
        'Data refreshes automatically when you switch to this tab.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'Compare months to spot seasonal buying patterns.',
        'A spike in spend with few invoices may indicate large bulk orders.',
      ],
    },
  ],
})

export default HelpDashboard
