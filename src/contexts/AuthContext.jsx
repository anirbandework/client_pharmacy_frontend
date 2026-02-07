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

  const adminLogin = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) throw new Error('Invalid credentials')

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

    if (!response.ok) throw new Error('Registration failed')
    return response.json()
  }

  const staffLogin = async (uuid) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/staff/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid })
    })

    if (!response.ok) throw new Error('Invalid UUID or staff inactive')

    const data = await response.json()
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('user_type', data.user_type)
    localStorage.setItem('shop_id', data.shop_id)
    localStorage.setItem('shop_name', data.shop_name)
    
    await checkAuth()
    return data
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, adminLogin, adminRegister, staffLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
