import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './Bien.module.css'

export default function Bien() {
  const navigate = useNavigate()
  const [pops, setPops] = useState(0)

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')}>← volver</button>

      <div className={styles.stage}>
        <div className={styles.figure}>
          <AnimatePresence>
            {pops > 0 && (
              <motion.div
                key={pops}
                className={styles.bubble}
                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 380, damping: 16 }}
              >
                bien.
              </motion.div>
            )}
          </AnimatePresence>

          <motion.img
            src="/photos/clau-bien.png"
            alt="Clau"
            className={styles.clau}
            draggable={false}
            animate={{ rotate: [-1.5, 1.5, -1.5], y: [0, -6, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className={styles.shadow} aria-hidden />
        </div>
      </div>

      <motion.button
        className={styles.cta}
        onClick={() => setPops((n) => n + 1)}
        whileTap={{ scale: 0.94, y: 3 }}
      >
        ¿Qué tal hoy el trabajo?
      </motion.button>
    </div>
  )
}
