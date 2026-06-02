import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './Gifts.module.css'

const GIFTS = [
  {
    id: 'revista',
    emoji: '📖',
    tag: 'Edición única',
    title: 'Tu revista',
    desc: 'Hecha a mano, solo para ti. Cada página con todo el cariño del mundo.',
    color: '#ff10c8',
    shadow: '#8a0040',
    pdf: '/gifts/revista.pdf',
  },
  // Añade más regalos aquí en el futuro
]

export default function Gifts() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(null)

  return (
    <div className={styles.page}>

      {/* Fondo leopardo */}
      <div className={styles.leopardBg} aria-hidden />
      <div className={styles.overlay} aria-hidden />

      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className={styles.back} onClick={() => navigate('/')} aria-label="Volver">
          ← volver
        </button>
        <p className={styles.eyebrow}>✦ solo para ti ✦</p>
        <h1 className={styles.title}>REGALOS</h1>
        <p className={styles.subtitle}>Todo lo que te he dado, aquí guardado para siempre.</p>
      </motion.div>

      {/* Grid de regalos */}
      <div className={styles.grid}>
        {GIFTS.map((gift, i) => (
          <motion.div
            key={gift.id}
            className={styles.card}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setOpen(gift)}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.cardEmoji}>{gift.emoji}</div>
            <div className={styles.cardTag}>{gift.tag}</div>
            <h2 className={styles.cardTitle} style={{ color: gift.color, textShadow: `2px 2px 0 ${gift.shadow}` }}>
              {gift.title}
            </h2>
            <p className={styles.cardDesc}>{gift.desc}</p>
            <div className={styles.cardBtn} style={{ background: gift.color }}>
              VER →
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal visor PDF */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={styles.modalInner}
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.modalHeader}>
                <span className={styles.modalTitle}>{open.emoji} {open.title}</span>
                <button className={styles.modalClose} onClick={() => setOpen(null)}>✕</button>
              </div>
              <iframe
                className={styles.pdfViewer}
                src={open.pdf}
                title={open.title}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}