import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import styles from './Gifts.module.css'
import FlipBook from '../components/ui/FlipBook'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const GIFTS = [
  {
    id: 'revista',
    tag: 'Edición única · 2025',
    title: 'Tu revista',
    desc: 'Hecha a mano, solo para ti.',
    accentColor: '#ff10c8',
    shadowColor: '#8a0040',
    pdf: '/gifts/revista.pdf',
    type: 'magazine',
  },
  // más regalos aquí
]

// ── Carga la portada (página 1) de un PDF ──────────────────────────────────
function usePdfCover(pdfUrl) {
  const [cover, setCover] = useState(null)
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const pdf = await pdfjsLib.getDocument({ url: new URL(pdfUrl, window.location.href).href }).promise
        const page = await pdf.getPage(1)
        const vp = page.getViewport({ scale: 1.4 })
        const canvas = document.createElement('canvas')
        canvas.width = vp.width
        canvas.height = vp.height
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise
        if (!cancelled) setCover(canvas.toDataURL('image/jpeg', 0.88))
      } catch (e) { console.warn('cover load error', e) }
    }
    load()
    return () => { cancelled = true }
  }, [pdfUrl])
  return cover
}

// ── Card 3D flotante ────────────────────────────────────────────────────────
function GiftCard3D({ gift, onOpen }) {
  const cover = usePdfCover(gift.pdf)
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
          {cover
            ? <img src={cover} alt={gift.title} className={styles.coverImg} draggable={false} />
            : <div className={styles.coverPlaceholder} style={{ background: gift.accentColor }}>
                <div className={styles.coverSpinner} />
              </div>
          }

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

      <AnimatePresence>
        {open && <FlipBook pdfUrl={open.pdf} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  )
}