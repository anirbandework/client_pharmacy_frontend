const HelpAIInsights = () => ({
  title: 'AI Insights',
  icon: '🧠',
  description: 'AI-generated purchase recommendations and anomaly detection powered by Gemini.',
  sections: [
    {
      heading: 'What you see here',
      points: [
        'Smart reorder suggestions based on stock depletion rate and lead time.',
        'Price anomaly alerts — products where the latest purchase rate is significantly higher than the historical average.',
        'Supplier risk flags — suppliers with irregular delivery patterns or frequent invoice rejections.',
        'Seasonal demand forecasts for top-selling categories.',
      ],
    },
    {
      heading: 'How to use',
      points: [
        'Click "Refresh Insights" to fetch the latest AI analysis.',
        'Expand any insight card to see the reasoning and supporting data points.',
        'Use the "Action" button on reorder suggestions to pre-fill an order template.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'AI insights are based on verified invoices only — the more data you approve, the better the recommendations.',
        'Review anomaly alerts promptly; they often indicate supplier overcharging or data entry errors.',
        'Insights refresh automatically once per day, or on demand via the refresh button.',
      ],
    },
  ],
})

export default HelpAIInsights
