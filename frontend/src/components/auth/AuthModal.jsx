import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const AuthModal = ({ type }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Close modal function
  const closeModal = () => {
    navigate('/')
  }

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  // Handle outside click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  // Switch between login/register
  const switchAuthType = (newType) => {
    navigate(`/${newType}`)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md"
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute -top-12 right-0 p-2 text-white hover:text-gray-200 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Auth Content */}
          <div className="premium-card p-6 relative">
            {type === 'login' ? (
              <LoginForm 
                switchToRegister={() => switchAuthType('register')}
                onClose={closeModal}
              />
            ) : (
              <RegisterForm 
                switchToLogin={() => switchAuthType('login')}
                onClose={closeModal}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModal