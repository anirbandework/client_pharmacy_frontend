const HelpMarginSimulator = () => ({
  title: 'Margin Simulator',
  icon: '⚡',
  description: 'Simulate the impact of changing purchase rates or selling prices on your profit margins — before committing to any change.',
  sections: [
    {
      heading: 'How the simulator works',
      points: [
        'Select a product from the dropdown.',
        'Adjust the simulated purchase rate or selling price using the sliders or input fields.',
        'The simulator instantly shows the new margin %, profit per unit, and projected monthly profit based on historical sales.',
      ],
    },
    {
      heading: 'Use cases',
      points: [
        "Evaluate a supplier's new price quote before accepting.",
        'Decide the minimum selling price to maintain a target margin.',
        'Plan bulk-purchase negotiation targets.',
      ],
    },
    {
      heading: 'Tips',
      points: [
        'The MRP cap is enforced — you cannot set a selling price above MRP.',
        'Simulations are not saved. They are purely for planning purposes.',
        'Compare multiple products side-by-side by opening two browser tabs.',
      ],
    },
  ],
})

export default HelpMarginSimulator
