import { useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function OTPInput({ value, onChange, length = 6 }) {
  const { isDark } = useTheme()
  const inputs = useRef([])

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus()
    }
  }, [])

  const handleChange = (index, val) => {
    if (!/^\d*$/.test(val)) return
    
    const newOTP = value.split('')
    newOTP[index] = val
    onChange(newOTP.join(''))

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData)
      const nextIndex = Math.min(pastedData.length, length - 1)
      inputs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl font-bold backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 transition-all"
          style={isDark ? {
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#ffffff',
          } : {
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(59,130,246,0.35)',
            color: '#1e293b',
          }}
        />
      ))}
    </div>
  )
}
