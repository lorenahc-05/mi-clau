import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
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
    offset: ['start 0.8', 'end 0.2'],
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
        <KissScroll progress={kissProgress} />
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

      {/* Fotos laterales */}
      <motion.div
        className={`${styles.heroPhoto} ${styles.heroPhotoLeft}`}
        initial={{ x: -80, opacity: 0, rotate: -8 }}
        animate={{ x: 0, opacity: 1, rotate: -6 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src="/photos/girl1.png" alt="placeholder 1" draggable={false} />
      </motion.div>

      <motion.div
        className={`${styles.heroPhoto} ${styles.heroPhotoRight}`}
        initial={{ x: 80, opacity: 0, rotate: 8 }}
        animate={{ x: 0, opacity: 1, rotate: 6 }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src="/photos/girl2.png" alt="placeholder 2" draggable={false} />
      </motion.div>

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
   BESO EN SCROLL — dos figuras que se inclinan y besan
══════════════════════════════════════════════════════ */
function KissScroll({ progress }) {
  // Figura izquierda: rota de -15° a +12° (se inclina hacia la derecha/beso)
  const rotateLeft  = useTransform(progress, [0.0, 0.5], [-18, 14])
  const xLeft       = useTransform(progress, [0.0, 0.5], ['-4vw', '14vw'])
  const scaleLeft   = useTransform(progress, [0.0, 0.5], [0.9, 1.05])

  // Figura derecha
  const rotateRight = useTransform(progress, [0.0, 0.5], [18, -14])
  const xRight      = useTransform(progress, [0.0, 0.5], ['4vw', '-14vw'])
  const scaleRight  = useTransform(progress, [0.0, 0.5], [0.9, 1.05])

  // Label que aparece en el beso
  const labelOpacity = useTransform(progress, [0.4, 0.55], [0, 1])
  const labelScale   = useTransform(progress, [0.4, 0.55], [0.7, 1])

  return (
    <div className={styles.kissWrap}>
      {/* Sticky container */}
      <div className={styles.kissSticky}>

        {/* Texto de fondo */}
        <p className={styles.kissLabel}>haz scroll</p>

        {/* Figura izquierda */}
        <motion.div
          className={`${styles.kissFig} ${styles.kissFigLeft}`}
          style={{ rotate: rotateLeft, x: xLeft, scale: scaleLeft }}
        >
          <img src="/photos/girl1.png" alt="" draggable={false} />
        </motion.div>

        {/* Figura derecha */}
        <motion.div
          className={`${styles.kissFig} ${styles.kissFigRight}`}
          style={{ rotate: rotateRight, x: xRight, scale: scaleRight }}
        >
          <img src="/photos/girl2.png" alt="" draggable={false} />
        </motion.div>

        {/* ❤ que aparece cuando se "besan" */}
        <motion.div
          className={styles.kissHeart}
          style={{ opacity: labelOpacity, scale: labelScale }}
        >
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