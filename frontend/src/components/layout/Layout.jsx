import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import MobileNav from './MobileNav'

const Layout = ({ children }) => {
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const [showMobileNav, setShowMobileNav] = useState(false)

  useEffect(() => {
    setShowMobileNav(false)
  }, [location])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onMenuToggle={() => setShowMobileNav(!showMobileNav)} />
      
      <AnimatePresence>
        {showMobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileNav(false)}
            />
            <MobileNav onClose={() => setShowMobileNav(false)} />
          </>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default Layout