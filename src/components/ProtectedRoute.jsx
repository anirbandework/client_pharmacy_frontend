import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

const ProtectedRoute = ({ children, requiredModule }) => {
  const [hasAccess, setHasAccess] = useState(null)
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    checkAccess()
  }, [requiredModule])

  const checkAccess = async () => {
    // SuperAdmin has access to everything
    if (userType === 'super_admin') {
      setHasAccess(true)
      return
    }

    // Check if user has permission for this module
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rbac/my-permissions`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const modules = response.data.modules || []
      const hasModule = modules.some(m => m.module_key === requiredModule)
      setHasAccess(hasModule)
    } catch (error) {
      setHasAccess(false)
    }
  }

  if (hasAccess === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
