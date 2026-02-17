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
        let endpoint = '/api/auth/staff/me'
        if (userType === 'admin') endpoint = '/api/auth/admin/me'
        if (userType === 'super_admin') endpoint = '/api/auth/super-admin/me'
        
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
    const payload = JSON.parse(atob(data.access_token.split('.')[1]))
    
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('user_type', data.user_type || payload.user_type)
    localStorage.setItem('user_name', data.user_name || payload.user_name)
    localStorage.setItem('organization_id', data.organization_id || payload.organization_id)
    
    await checkAuth()
    return data
  }

  const adminSignup = async (phone, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/admin/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Signup failed')
    }

    return response.json()
  }

  // Staff OTP Flow
  const staffSendOTP = async (phone, password) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/staff/send-otp`, {
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

  const staffVerifyOTP = async (phone, otpCode) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/staff/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp_code: otpCode })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Invalid OTP')
    }

    const data = await response.json()
    const payload = JSON.parse(atob(data.access_token.split('.')[1]))
    
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('user_type', data.user_type || payload.user_type)
    localStorage.setItem('user_name', data.user_name || payload.user_name)
    localStorage.setItem('shop_code', data.shop_code || payload.shop_code)
    localStorage.setItem('shop_name', data.shop_name || payload.shop_name)
    
    await checkAuth()
    return data
  }

  const staffSignup = async (phone, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/staff/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Signup failed')
    }

    return response.json()
  }

  const superAdminLogin = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/super-admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }

    const data = await response.json()
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('user_type', data.user_type)
    
    await checkAuth()
    return data
  }

  const superAdminSendOTP = async (phone, password) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/super-admin/send-otp`, {
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

  const superAdminVerifyOTP = async (phone, otpCode) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/super-admin/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp_code: otpCode })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Invalid OTP')
    }

    const data = await response.json()
    const payload = JSON.parse(atob(data.access_token.split('.')[1]))
    
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('user_type', data.user_type || payload.user_type)
    localStorage.setItem('user_name', data.user_name || payload.user_name)
    
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
      adminSignup, 
      staffSendOTP, 
      staffVerifyOTP,
      staffSignup,
      superAdminLogin,
      superAdminSendOTP,
      superAdminVerifyOTP,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
