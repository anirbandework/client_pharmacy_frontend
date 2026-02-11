import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const userType = localStorage.getItem('user_type')
        const endpoint = userType === 'admin' ? '/api/auth/admin/me' : '/api/auth/staff/me'
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          localStorage.clear()
        }
      } catch (error) {
        localStorage.clear()
      }
    }
    setLoading(false)
  }

  // Admin OTP Flow
  const adminSendOTP = async (phone, password) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to send OTP')
      }

      return response.json()
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.')
      }
      throw err
    }
  }

  const adminVerifyOTP = async (phone, otpCode) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/admin/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp_code: otpCode })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Invalid OTP')
    }

    const data = await response.json()
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('user_type', data.user_type)
    
    await checkAuth()
    return data
  }

  const adminRegister = async (registerData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }

    return response.json()
  }

  // Staff OTP Flow
  const staffSendOTP = async (uuid, phone) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/staff/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, phone }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to send OTP')
      }

      return response.json()
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.')
      }
      throw err
    }
  }

  const staffVerifyOTP = async (uuid, phone, otpCode) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/staff/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid, phone, otp_code: otpCode })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Invalid OTP')
    }

    const data = await response.json()
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('user_type', data.user_type)
    localStorage.setItem('shop_info', JSON.stringify({
      shop_id: data.shop_id,
      shop_name: data.shop_name
    }))
    
    await checkAuth()
    return data
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      adminSendOTP, 
      adminVerifyOTP, 
      adminRegister, 
      staffSendOTP, 
      staffVerifyOTP, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
