import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'
import SpritePets from '../components/sprites/SpritePets'

export default function Home() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const kissRef = useRef(null)
  const citasRef = useRef(null)
  const [confettiFired, setConfettiFired] = useState(false)

  // Scroll global de la página
  const { scrollYProgress } = useScroll({ container: pageRef })
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 18 })

  // ── Sección beso: scroll local ──
  const { scrollYProgress: kissProgress } = useScroll({
    target: kissRef,
    offset: ['start center', 'end center'],
  })

  // ── Disparar confeti cuando citasRef entra en viewport ──
  useEffect(() => {
    if (!citasRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !confettiFired) setConfettiFired(true) },
      { threshold: 0.3 }
    )
    obs.observe(citasRef.current)
    return () => obs.disconnect()
  }, [confettiFired])

  return (
    <div className={styles.page} ref={pageRef}>

      {/* ════════════════════════════════
          MONIGOTES — capa flotante sobre toda la página
      ════════════════════════════════ */}
      <SpritePets className={styles.spritesLayer} />

      {/* ════════════════════════════════
          SECCIÓN 1 — HERO
      ════════════════════════════════ */}
      <HeroSection />

      {/* ════════════════════════════════
          SECCIÓN 2 — BESO EN SCROLL
      ════════════════════════════════ */}
      <section className={styles.kissSection} ref={kissRef}>
        <KissScroll />
      </section>

      {/* ════════════════════════════════
          SECCIÓN 3 — CITAS
      ════════════════════════════════ */}
      <section className={styles.citasSection} ref={citasRef}>
        {confettiFired && <LeopardConfetti />}
        <CitasBlock onPress={() => navigate('/citas')} />
      </section>

      {/* ════════════════════════════════
          SECCIÓN 4 — REGALOS
      ════════════════════════════════ */}
      <section className={styles.giftsSection}>
        <GiftsBlock onPress={() => navigate('/regalos')} />
      </section>

    </div>
  )
}

/* ══════════════════════════════════════════════════════
   HERO — Título enorme + fotos laterales
══════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className={styles.hero}>

      {/* Fondo leopardo */}
      <div className={styles.leopardBg} aria-hidden />
      <div className={styles.heroOverlay} aria-hidden />

      {/* Título central */}
      <div className={styles.heroCenter}>
        <motion.p
          className={styles.heroEyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          solo para ti
        </motion.p>

        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 40, scaleX: 0.9 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          BONDIA
        </motion.h1>
        <motion.h1
          className={`${styles.heroTitle} ${styles.heroTitleAccent}`}
          initial={{ opacity: 0, y: 40, scaleX: 0.9 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          MI CLAU
        </motion.h1>

        <motion.p
          className={styles.heroSub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ↓ baja ↓
        </motion.p>
      </div>

    </section>
  )
}

/* ══════════════════════════════════════════════════════
   BESO EN SCROLL — scroll hijacking cuando está en pantalla
══════════════════════════════════════════════════════ */
function KissScroll() {
  const sectionRef = useRef(null)
  const progress   = useMotionValue(0)
  const isActive   = useRef(false)
  const progRef    = useRef(0)

  const xLeft       = useTransform(progress, [0, 1], ['-55vw', '0vw'])
  const rotateLeft  = useTransform(progress, [0, 1], [-6, 0])
  const xRight         = useTransform(progress, [0, 1], ['55vw', '-14vw'])
  const rotateRight    = useTransform(progress, [0, 1], [6, 0])
  const translateRight = useTransform(progress, [0, 1], [0, -10])
  const scaleRight     = useTransform(progress, [0, 1], [1, 0.78])
  const labelOpacity = useTransform(progress, [0.85, 1], [0, 1])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActive.current = entry.isIntersecting
        // Reset al entrar para que siempre empiece desde el principio
        if (entry.isIntersecting && progRef.current === 0) {
          progress.set(0)
        }
      },
      { threshold: 0.30 }
    )
    observer.observe(section)

    const onWheel = (e) => {
      if (!isActive.current) return
      const p = progRef.current
      // Bloquear siempre si progress está entre 0 y 1
      if (e.deltaY > 0 && p < 1) {
        e.preventDefault()
        e.stopPropagation()
        progRef.current = Math.min(1, p + e.deltaY * 0.004)
        progress.set(progRef.current)
        return
      }
      if (e.deltaY < 0 && p > 0) {
        e.preventDefault()
        e.stopPropagation()
        progRef.current = Math.max(0, p + e.deltaY * 0.004)
        progress.set(progRef.current)
        return
      }
    }

    let touchStartY = 0
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const onTouchMove  = (e) => {
      if (!isActive.current) return
      const dy = touchStartY - e.touches[0].clientY
      const p  = progRef.current
      if (dy > 0 && p < 1) {
        e.preventDefault()
        e.stopPropagation()
        progRef.current = Math.min(1, p + Math.abs(dy) * 0.006)
        progress.set(progRef.current)
        touchStartY = e.touches[0].clientY
        return
      }
      if (dy < 0 && p > 0) {
        e.preventDefault()
        e.stopPropagation()
        progRef.current = Math.max(0, p - Math.abs(dy) * 0.006)
        progress.set(progRef.current)
        touchStartY = e.touches[0].clientY
        return
      }
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      observer.disconnect()
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [progress])

  return (
    <div ref={sectionRef} className={styles.kissWrap}>
      <div className={styles.kissSticky}>
        <p className={styles.kissLabel}>haz scroll</p>

        <motion.div
          className={`${styles.kissFig} ${styles.kissFigLeft}`}
          style={{ rotate: rotateLeft, x: xLeft }}
        >
          <img src="/photos/beso_izq.png" alt="" draggable={false} />
        </motion.div>

        <motion.div
          className={`${styles.kissFig} ${styles.kissFigRight}`}
          style={{ rotate: rotateRight, x: xRight, y: translateRight, scale: scaleRight }}
        >
          <img src="/photos/beso_der.png" alt="" draggable={false} />
        </motion.div>

        <motion.div className={styles.kissHeart} style={{ opacity: labelOpacity }}>
          ♥
        </motion.div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   CITAS BLOCK
══════════════════════════════════════════════════════ */
function CitasBlock({ onPress }) {
  return (
    <motion.div
      className={styles.citasInner}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className={styles.citasEyebrow}>✦ tengo algo para ti ✦</p>

      <h2 className={styles.citasTitle}>CITAS</h2>

      <p className={styles.citasDesc}>
        Planes para nosotras.<br />Elige dónde vamos este domingo.
      </p>

      <motion.button
        className={styles.citasBtn}
        onClick={onPress}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
      >
        VER LAS OPCIONES →
      </motion.button>
    </motion.div>
  )
}
/* ══════════════════════════════════════════════════════
   GIFTS BLOCK
══════════════════════════════════════════════════════ */
function GiftsBlock({ onPress }) {
  return (
    <motion.div
      className={styles.giftsInner}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className={styles.giftsEyebrow}>✦ con todo mi amor ✦</p>
      <h2 className={styles.giftsTitle}>REGALOS</h2>
      <p className={styles.giftsDesc}>
        Todo lo que te he dado,<br />guardado aquí para siempre.
      </p>
      <motion.button
        className={styles.giftsBtn}
        onClick={onPress}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
      >
        VER LOS REGALOS →
      </motion.button>
    </motion.div>
  )
}
/* ══════════════════════════════════════════════════════
   CONFETI LEOPARDO
══════════════════════════════════════════════════════ */
const CONF_COLORS = ['#4455ee', '#ff10c8', '#ff5500', '#7755dd', '#00ccff', '#d4f060', '#111111']

function LeopardConfetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.0,
    dur: Math.random() * 2.5 + 2,
    size: Math.random() * 10 + 5,
    drift: (Math.random() - 0.5) * 200,
    spin: (Math.random() - 0.5) * 720,
    color: CONF_COLORS[i % CONF_COLORS.length],
    isRound: i % 4 === 0,
    // Mancha leopardo: elipse irregular
    rx: Math.random() * 8 + 4,
    ry: Math.random() * 5 + 3,
  }))

  return (
    <div className={styles.confettiWrap} aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.x}%`,
            width: p.isRound ? p.size : p.rx * 2,
            height: p.isRound ? p.size : p.ry * 2,
            background: p.color,
            borderRadius: p.isRound ? '50%' : `${p.rx}px ${p.ry}px`,
            opacity: 0,
          }}
          animate={{
            y: ['0px', '110vh'],
            x: [0, p.drift],
            rotate: [0, p.spin],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}