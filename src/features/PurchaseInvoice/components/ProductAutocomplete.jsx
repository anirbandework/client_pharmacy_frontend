import React, { useState, useEffect, useRef } from 'react'
import { purchaseInvoiceAPI } from '../services/api'

const ProductAutocomplete = ({ value, onChange, placeholder, className }) => {
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = async (searchText) => {
    if (!searchText || searchText.length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    setLoading(true)
    try {
      const response = await purchaseInvoiceAPI.getProductNames(searchText)
      setSuggestions(response.data || [])
      setShowDropdown(response.data && response.data.length > 0)
    } catch (error) {
      console.error('Failed to fetch product names:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    fetchSuggestions(newValue)
  }

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion)
    setShowDropdown(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value || ''}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        onFocus={() => value && value.length >= 2 && suggestions.length > 0 && setShowDropdown(true)}
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-b-0"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  )
}

export default ProductAutocomplete
