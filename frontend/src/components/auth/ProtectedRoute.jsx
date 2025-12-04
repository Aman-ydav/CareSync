import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If roles are specified, check if user has required role
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'DOCTOR') {
      return <Navigate to="/dashboard" replace />
    } else if (user.role === 'PATIENT') {
      return <Navigate to="/dashboard" replace />
    } else if (user.role === 'ADMIN') {
      return <Navigate to="/dashboard" replace />
    }
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute