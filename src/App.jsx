import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import TinderScreen from './components/tinder/TinderScreen'
import Home from './pages/Home'
import Dates from './pages/Dates'
import DateDetail from './pages/DateDetail'
import CitaCustomPage from './pages/CitaCustomPage'
import Gifts from './pages/Gifts'

// ── Animated route wrapper ────────────────────────────────────────────────────
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/citas" element={<PageTransition><Dates /></PageTransition>} />
        <Route path="/citas/:id" element={<PageTransition><DateDetail /></PageTransition>} />
        <Route path="/citas/custom/:id" element={<PageTransition><CitaCustomPage /></PageTransition>} />
        <Route path="/regalos" element={<PageTransition><Gifts /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [matched, setMatched] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {!matched ? (
        // Tinder gate
        <motion.div
          key="tinder"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.65, ease: [0.87, 0, 0.13, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 50 }}
        >
          <TinderScreen onMatch={() => setMatched(true)} />
        </motion.div>
      ) : (
        // Main app
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </motion.div>
      )}
    </AnimatePresence>
  )
}