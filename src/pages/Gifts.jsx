import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './Gifts.module.css'

const GIFTS = [
  {
    id: 'revista',
    tag: 'Edición única · 2025',
    title: 'Tu revista',
    desc: 'Hecha a mano, solo para ti.',
    accentColor: '#ff10c8',
    shadowColor: '#8a0040',
    coverImg: '/gifts/portada.jpg',
    driveUrl: 'https://drive.google.com/file/d/1niY2c9xhHGFDYpe72adrMsp4tBQ2Y5T3/preview',
    type: 'magazine',
  },
]

// ── Card 3D flotante ────────────────────────────────────────────────────────
function GiftCard3D({ gift, onOpen }) {
  const ref = useRef(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [18, -18]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-18, 18]), { stiffness: 200, damping: 20 })
  const glareX  = useTransform(mouseX, [-1, 1], ['0%', '100%'])
  const glareY  = useTransform(mouseY, [-1, 1], ['0%', '100%'])

  function handleMove(e) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    mouseX.set(((clientX - rect.left) / rect.width) * 2 - 1)
    mouseY.set(((clientY - rect.top)  / rect.height) * 2 - 1)
  }

  function handleLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div className={styles.cardScene}>
      <motion.div
        ref={ref}
        className={styles.card3d}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchMove={handleMove}
        onTouchEnd={handleLeave}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.97 }}
        onClick={onOpen}
      >
        {/* Portada */}
        <div className={styles.cardFace}>
          {gift.coverImg
            ? <img src={gift.coverImg} alt={gift.title} className={styles.coverImg} draggable={false} />
            : <div className={styles.coverPlaceholder} style={{ background: gift.accentColor }} />}

          {/* Efecto brillo al mover */}
          <motion.div
            className={styles.glare}
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.28) 0%, transparent 65%)`,
            }}
          />

          {/* Sombra lateral izquierda (lomo) */}
          <div className={styles.spine3d} style={{ background: gift.shadowColor }} />
        </div>

        {/* Sombra flotante */}
        <motion.div
          className={styles.cardShadow}
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [0.85, 0.95, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Info debajo */}
      <motion.div
        className={styles.cardInfo}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className={styles.cardTag}>{gift.tag}</span>
        <h2 className={styles.cardTitle} style={{ color: gift.accentColor, textShadow: `2px 2px 0 ${gift.shadowColor}` }}>
          {gift.title}
        </h2>
        <p className={styles.cardDesc}>{gift.desc}</p>
        <motion.button
          className={styles.cardBtn}
          style={{ background: gift.accentColor, boxShadow: `3px 3px 0 ${gift.shadowColor}` }}
          onClick={onOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ABRIR REVISTA →
        </motion.button>
      </motion.div>
    </div>
  )
}

// ── Página principal ────────────────────────────────────────────────────────
export default function Gifts() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(null)

  return (
    <div className={styles.page}>
      <div className={styles.leopardBg} aria-hidden />
      <div className={styles.overlay} aria-hidden />

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className={styles.back} onClick={() => navigate('/')}>← volver</button>
        <p className={styles.eyebrow}>✦ solo para ti ✦</p>
        <h1 className={styles.title}>REGALOS</h1>
        <p className={styles.subtitle}>Todo lo que te he dado, aquí guardado para siempre.</p>
      </motion.div>

      <div className={styles.grid}>
        {GIFTS.map((gift, i) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <GiftCard3D gift={gift} onOpen={() => setOpen(gift)} />
          </motion.div>
        ))}
      </div>

      {/* Modal visor Drive */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              className={styles.modalBox}
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.modalClose} onClick={() => setOpen(null)}>✕</button>
              <iframe
                src={open.driveUrl}
                className={styles.driveViewer}
                allow="autoplay"
                title={open.title}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}