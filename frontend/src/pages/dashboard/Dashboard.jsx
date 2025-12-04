import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import DoctorDashboard from './DoctorDashboard'
import PatientDashboard from './PatientDashboard'
import AdminDashboard from './AdminDashboard'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" />
  }

  switch (user.role) {
    case 'DOCTOR':
      return <DoctorDashboard />
    case 'ADMIN':
      return <AdminDashboard />
    case 'PATIENT':
    default:
      return <PatientDashboard />
  }
}

export default Dashboard