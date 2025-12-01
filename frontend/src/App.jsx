import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import AppRouter from './router/AppRouter'
import { fetchCurrentUser } from './features/auth/authSlice'
import LoadingScreen from './components/layout/LoadingScreen'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('accessToken')
      
      if (token && !user) {
        try {
          await dispatch(fetchCurrentUser()).unwrap()
        } catch (error) {
          console.error('Failed to fetch user:', error)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
        }
      }
      
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }

    initializeApp()
  }, [dispatch, user])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingScreen />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AppRouter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App