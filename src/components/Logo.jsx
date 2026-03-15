const Logo = ({ size = 40, id = 'lgx' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563eb"/>
        <stop offset="52%" stopColor="#4f46e5"/>
        <stop offset="100%" stopColor="#7c3aed"/>
      </linearGradient>
      <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="white" stopOpacity="0.18"/>
        <stop offset="60%" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="40" height="40" rx="10" fill={`url(#${id}-bg)`}/>

    {/* Top shine */}
    <rect width="40" height="40" rx="10" fill={`url(#${id}-shine)`}/>

    {/* "L" — vertical stroke */}
    <rect x="7" y="9" width="4.5" height="22" rx="2" fill="white"/>
    {/* "L" — horizontal stroke */}
    <rect x="7" y="27" width="13" height="4.5" rx="2" fill="white"/>

    {/* "X" — diagonal 1: top-left → bottom-right */}
    <line x1="23.5" y1="9" x2="33" y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    {/* "X" — diagonal 2: top-right → bottom-left */}
    <line x1="33" y1="9" x2="23.5" y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
)

export default Logo
