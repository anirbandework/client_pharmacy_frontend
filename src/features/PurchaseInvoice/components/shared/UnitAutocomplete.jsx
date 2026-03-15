import { useState, useEffect, useRef } from 'react'

const UnitAutocomplete = ({ value, onChange, placeholder, className }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef(null)

  const predefinedUnits = [
    { value: 'Box', desc: 'Outer packaging containing multiple strips/bottles' },
    { value: 'Strip', desc: 'Blister pack (e.g., 10 tablets in a strip)' },
    { value: 'Bottle', desc: 'Liquid medicines, syrups' },
    { value: 'Vial', desc: 'Injectable medicines' },
    { value: 'Tube', desc: 'Ointments, creams' },
    { value: 'Sachet', desc: 'Powder medicines' },
    { value: 'Ampoule', desc: 'Single-dose injectable' },
    { value: 'Capsule', desc: 'Individual capsules' },
    { value: 'Tablet', desc: 'Individual tablets' },
    { value: 'Box/Strip', desc: 'Selling by box but can also sell individual strips' },
    { value: 'Strip/Tablet', desc: 'Selling by strip but can also sell individual tablets' },
    { value: 'Box/Bottle', desc: 'Box containing bottles' },
    { value: 'Carton/Box', desc: 'Carton containing boxes' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    onChange(e.target.value)
  }

  const handleSelectUnit = (unit) => {
    onChange(unit)
    setShowDropdown(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value || ''}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        className={className}
      />
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predefinedUnits.map((unit, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectUnit(unit.value)}
              className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-b border-gray-200 dark:border-slate-700 last:border-b-0"
            >
              <div className="font-semibold text-sm text-gray-800 dark:text-slate-200">{unit.value}</div>
              <div className="text-xs text-gray-500 dark:text-slate-500">{unit.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UnitAutocomplete
