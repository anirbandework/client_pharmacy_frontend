import { Target } from 'lucide-react'

const HelpMarginPlayground = () => ({
  title: 'Margin Playground',
  icon: <Target className="w-5 h-5" />,
  description: 'Visualise and analyse profit margins across all products in your inventory.',
  sections: [
    {
      heading: 'What you see here',
      points: [
        "Each product's purchase rate vs. MRP.",
        'Calculated profit margin % = (MRP − Rate) / MRP × 100.',
        'Distribution chart showing how many products fall in each margin band.',
        'Lowest-margin products highlighted for attention.',
      ],
    },
    {
      heading: 'How to use',
      points: [
        'Filter by shop, supplier, or product category.',
        'Sort by margin to find the least/most profitable products.',
        'Use the search bar to look up a specific medicine.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'Products with margins below 10% may not cover operational costs.',
        'High-margin products with slow sales are good candidates for promotions.',
        'Margins are calculated on the latest verified invoice rate — older stock may have different cost.',
      ],
    },
  ],
})

export default HelpMarginPlayground
