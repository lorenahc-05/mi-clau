import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion'
import styles from './TinderScreen.module.css'

// ─── Config — edita esto con tus datos ───────────────────────────────────────
const PHOTOS = [
  '/photos/lorena1.jpeg',
  '/photos/lorena2.jpeg',
  // Añade más fotos aquí: '/photos/lorena3.jpeg', etc.
]

const PROFILE = {
  name: 'Lolelo',
  age: 24,
  distance: '0 km de distancia',
  bio: '✨ pila de amor para dar ✨\nAmante de los gatos, el café y las buenas charlas.\nSwipe right si quieres conocerme 🥰',
  photo: PHOTOS[Math.floor(Math.random() * PHOTOS.length)],
}

const SWIPE_THRESHOLD = 100

export default function TinderScreen({ onMatch }) {
  const [phase, setPhase] = useState('card') // card | matched | noped
  const [showMatchAnim, setShowMatchAnim] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Visual feedback while dragging
  const rotate = useTransform(x, [-200, 200], [-22, 22])
  const likeOpacity = useTransform(x, [20, 80], [0, 1])
  const nopeOpacity = useTransform(x, [-80, -20], [1, 0])
  const cardScale = useTransform(x, [-200, 0, 200], [0.97, 1, 0.97])

  const handleDragEnd = (_, info) => {
    const offsetX = info.offset.x
    const velocityX = info.velocity.x

    if (offsetX > SWIPE_THRESHOLD || velocityX > 500) {
      // MATCH — swipe right
      animate(x, 600, { duration: 0.4, ease: 'easeOut' })
      setTimeout(() => {
        setPhase('matched')
        setShowMatchAnim(true)
        setTimeout(() => onMatch(), 2200)
      }, 350)
    } else if (offsetX < -SWIPE_THRESHOLD || velocityX < -500) {
      // NOPE — swipe left
      animate(x, -600, { duration: 0.4, ease: 'easeOut' })
      setTimeout(() => setPhase('noped'), 380)
    } else {
      // Snap back
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 })
    }
  }

  const handleLikeBtn = () => {
    animate(x, 600, { duration: 0.45, ease: 'easeOut' })
    setTimeout(() => {
      setPhase('matched')
      setShowMatchAnim(true)
      setTimeout(() => onMatch(), 2200)
    }, 400)
  }

  const handleNopeBtn = () => {
    animate(x, -600, { duration: 0.45, ease: 'easeOut' })
    setTimeout(() => setPhase('noped'), 420)
  }

  return (
    <div className={styles.screen}>

      {/* Floral SVG ornaments */}
      <FloralDecor />

      {/* Logo Tinder-style */}
      <div className={styles.topBar}>
        <span className={styles.logo}>💕</span>
        <span className={styles.logoText}>para ti</span>
      </div>

      <AnimatePresence mode="wait">

        {/* ── TARJETA ── */}
        {phase === 'card' && (
          <motion.div
            key="card-phase"
            className={styles.cardWrap}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: var_ease_spring }}
          >
            {/* The draggable card */}
            <motion.div
              className={styles.card}
              style={{ x, y, rotate, scale: cardScale }}
              drag="x"
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              whileDrag={{ cursor: 'grabbing' }}
            >
              {/* LIKE stamp */}
              <motion.div className={`${styles.stamp} ${styles.stampLike}`} style={{ opacity: likeOpacity }}>
                MATCH
              </motion.div>
              {/* NOPE stamp */}
              <motion.div className={`${styles.stamp} ${styles.stampNope}`} style={{ opacity: nopeOpacity }}>
                NOPE
              </motion.div>

              {/* Photo */}
              <div className={styles.photo}>
                {PROFILE.photo ? (
                  <img src={PROFILE.photo} alt={PROFILE.name} className={styles.photoImg} />
                ) : (
                  <PlaceholderPhoto />
                )}
                {/* Photo gradient overlay */}
                <div className={styles.photoOverlay} />
              </div>

              {/* Profile info */}
              <div className={styles.profileInfo}>
                <div className={styles.nameRow}>
                  <h2 className={styles.name}>{PROFILE.name}</h2>
                  <span className={styles.age}>{PROFILE.age}</span>
                </div>
                <p className={styles.distance}>📍 {PROFILE.distance}</p>
                <p className={styles.bio}>{PROFILE.bio}</p>
              </div>
            </motion.div>

            {/* Hint */}
            <p className={styles.hint}>Desliza para decidir ✨</p>

            {/* Action buttons */}
            <div className={styles.buttons}>
              <button className={`${styles.btn} ${styles.btnNope}`} onClick={handleNopeBtn} aria-label="Nope">
                <span>✕</span>
              </button>
              <button className={`${styles.btn} ${styles.btnLike}`} onClick={handleLikeBtn} aria-label="Like">
                <span>♥</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ── MATCH ── */}
        {phase === 'matched' && (
          <MatchScreen key="match" />
        )}

        {/* ── NOPED ── */}
        {phase === 'noped' && (
          <NopedScreen key="nope" onRetry={() => {
            x.set(0)
            y.set(0)
            setPhase('card')
          }} />
        )}

      </AnimatePresence>
    </div>
  )
}

// ─── Placeholder photo gradient ───────────────────────────────────────────────
function PlaceholderPhoto() {
  return (
    <div className={styles.placeholder}>
      <div className={styles.placeholderIcon}>📸</div>
      <p className={styles.placeholderText}>
        Cambia <code>PROFILE.photo</code><br />en TinderScreen.jsx
      </p>
    </div>
  )
}

// ─── Match screen ─────────────────────────────────────────────────────────────
function MatchScreen() {
  return (
    <motion.div
      className={styles.resultScreen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={styles.matchBurst}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        💕
      </motion.div>

      <motion.div
        className={styles.matchTitle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <span className={styles.matchIs}>Es un</span>
        <span className={styles.matchWord}>Match!</span>
      </motion.div>

      <motion.p
        className={styles.matchSub}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Sabía que dirías que sí 🥰
      </motion.p>

      {/* Confetti hearts */}
      <Hearts />
    </motion.div>
  )
}

// ─── Noped screen ─────────────────────────────────────────────────────────────
function NopedScreen({ onRetry }) {
  return (
    <motion.div
      className={styles.resultScreen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breaking heart */}
      <motion.div
        className={styles.brokenHeart}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <BrokenHeartSVG />
      </motion.div>

      <motion.p
        className={styles.nopeTitle}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        ¿En serio...?
      </motion.p>
      <motion.p
        className={styles.nopeSub}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Pensándolo bien... ¿segura?
      </motion.p>

      <motion.button
        className={styles.retryBtn}
        onClick={onRetry}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.95 }}
      >
        Volver a pensarlo 💭
      </motion.button>
    </motion.div>
  )
}

// ─── Floating hearts confetti ─────────────────────────────────────────────────
function Hearts() {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: Math.random() * 2 + 2,
    size: Math.random() * 20 + 12,
    drift: (Math.random() - 0.5) * 120,
  }))

  return (
    <div className={styles.heartsWrap} aria-hidden>
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className={styles.heartPiece}
          style={{ left: `${h.x}%`, fontSize: h.size }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ y: -200, x: h.drift, opacity: [0, 1, 1, 0] }}
          transition={{ duration: h.duration, delay: h.delay, ease: 'easeOut' }}
        >
          {['💕', '💗', '💖', '💝', '❤️'][Math.floor(Math.random() * 5)]}
        </motion.span>
      ))}
    </div>
  )
}

// ─── Broken heart SVG animated ───────────────────────────────────────────────
function BrokenHeartSVG() {
  return (
    <svg viewBox="0 0 100 90" className={styles.brokenHeartSvg} aria-hidden>
      {/* Left half */}
      <motion.path
        d="M50 80 C30 65 5 50 5 28 C5 15 15 5 28 5 C38 5 46 11 50 18"
        fill="#ff4458"
        initial={{ x: 0, y: 0, rotate: 0 }}
        animate={{ x: -8, y: 4, rotate: -8 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Right half */}
      <motion.path
        d="M50 80 C70 65 95 50 95 28 C95 15 85 5 72 5 C62 5 54 11 50 18"
        fill="#ff4458"
        initial={{ x: 0, y: 0, rotate: 0 }}
        animate={{ x: 8, y: 4, rotate: 8 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Crack line */}
      <motion.path
        d="M50 18 L44 38 L54 42 L46 65 L50 80"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
    </svg>
  )
}

// small helper to avoid template literal in JSX style prop
const var_ease_spring = [0.16, 1, 0.3, 1]

// ─── Floral decorative SVG ornaments ────────────────────────────────────────
function FloralDecor() {
  return (
    <svg
      className={styles.floralDecor}
      viewBox="0 0 400 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g opacity="0.22">
        <ellipse cx="30" cy="26" rx="5" ry="9" fill="#f5d5d3" transform="rotate(-20 30 26)"/>
        <ellipse cx="40" cy="32" rx="5" ry="9" fill="#f5d5d3" transform="rotate(30 40 32)"/>
        <ellipse cx="20" cy="32" rx="5" ry="9" fill="#f5d5d3" transform="rotate(-70 20 32)"/>
        <circle cx="30" cy="32" r="6" fill="#e8a4a0"/>
        <path d="M30 42 Q35 62 28 80" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
      <g opacity="0.18" transform="translate(345, 15)">
        <ellipse cx="20" cy="30" rx="6" ry="10" fill="#c9a96e" transform="rotate(10 20 30)"/>
        <ellipse cx="30" cy="20" rx="6" ry="10" fill="#e8a4a0" transform="rotate(60 30 20)"/>
        <ellipse cx="35" cy="35" rx="6" ry="10" fill="#f5d5d3" transform="rotate(-40 35 35)"/>
        <ellipse cx="15" cy="35" rx="6" ry="10" fill="#c9a96e" transform="rotate(-100 15 35)"/>
        <circle cx="25" cy="30" r="6" fill="#e8a4a0"/>
      </g>
      <g opacity="0.15" transform="translate(0, 700)">
        <path d="M5 60 Q30 30 55 10" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <ellipse cx="25" cy="40" rx="8" ry="14" fill="#e8a4a0" transform="rotate(-50 25 40)"/>
        <ellipse cx="42" cy="22" rx="7" ry="12" fill="#f5d5d3" transform="rotate(-30 42 22)"/>
      </g>
      <g opacity="0.17" transform="translate(330, 720)">
        <ellipse cx="30" cy="13" rx="4" ry="8" fill="#f5d5d3"/>
        <ellipse cx="40" cy="20" rx="4" ry="8" fill="#e8a4a0" transform="rotate(60 40 20)"/>
        <ellipse cx="38" cy="32" rx="4" ry="8" fill="#f5d5d3" transform="rotate(120 38 32)"/>
        <ellipse cx="22" cy="32" rx="4" ry="8" fill="#e8a4a0" transform="rotate(-120 22 32)"/>
        <ellipse cx="20" cy="20" rx="4" ry="8" fill="#f5d5d3" transform="rotate(-60 20 20)"/>
        <circle cx="30" cy="25" r="6" fill="#c9a96e"/>
      </g>
      <g opacity="0.12">
        <ellipse cx="8"  cy="380" rx="4" ry="7" fill="#e8a4a0" transform="rotate(25 8 380)"/>
        <ellipse cx="6"  cy="460" rx="4" ry="7" fill="#f5d5d3" transform="rotate(40 6 460)"/>
        <ellipse cx="394" cy="350" rx="4" ry="7" fill="#e8a4a0" transform="rotate(-25 394 350)"/>
        <ellipse cx="393" cy="440" rx="4" ry="8" fill="#c9a96e" transform="rotate(-45 393 440)"/>
      </g>
    </svg>
  )
}