import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './Suerte.module.css'

// ── Heart path (objectBoundingBox 0..1) ─────────────────────────────────────
const HEART_PATH =
  'M 0.5,1 C 0.5,1 0,0.65 0,0.35 C 0,0.15 0.15,0 0.35,0 C 0.45,0 0.5,0.05 0.5,0.15 ' +
  'C 0.5,0.05 0.55,0 0.65,0 C 0.85,0 1,0.15 1,0.35 C 1,0.65 0.5,1 0.5,1 Z'

const STAR_PATH =
  'M25.5 0l6.6 17.9L51 19l-14.3 11.9L41.4 48 25.5 37.7 9.6 48l4.7-17.1L0 19l18.9-1.1z'

// ── Recortable letter "chips" — imitando la hoja de letras recortadas ───────
const CHIP_STYLES = [
  { bg: '#f4ecdb', color: '#1c3b57', font: "'Anton', sans-serif", r: '2px 8px 3px 9px' },
  { bg: '#8a2332', color: '#f4ecdb', font: "'Caveat', cursive", r: '9px 3px 8px 2px' },
  { bg: '#e6ac36', color: '#231a12', font: "'Bebas Neue', sans-serif", r: '4px 10px 4px 6px' },
  { bg: '#33685a', color: '#f4ecdb', font: "'Permanent Marker', cursive", r: '8px 4px 9px 3px' },
  { bg: '#f4ecdb', color: '#8a2332', font: "'Anton', sans-serif", r: '3px 9px 2px 8px' },
  { bg: '#264a68', color: '#f4ecdb', font: "'Caveat', cursive", r: '9px 5px 3px 8px' },
  { bg: '#d9705f', color: '#231a12', font: "'Bebas Neue', sans-serif", r: '6px 3px 8px 4px' },
  { bg: '#f4ecdb', color: '#231a12', font: "'Kalam', cursive", r: '4px 7px 4px 9px' },
]
const ROTATIONS = [-7, 5, -4, 8, -6, 3, 7, -3, 6, -8, 4, -5, 2, -2, 9, -9, -5, 4, -3, 6]

function CutoutLetters({ letters, offset }) {
  return letters.map((ch, i) => {
    const idx = offset + i
    const chip = CHIP_STYLES[idx % CHIP_STYLES.length]
    const rot = ROTATIONS[idx % ROTATIONS.length]
    return (
      <span
        key={i}
        className={styles.letter}
        style={{
          background: chip.bg,
          color: chip.color,
          fontFamily: chip.font,
          borderRadius: chip.r,
          '--rot': `${rot}deg`,
          '--i': idx % 9,
        }}
      >
        {ch}
      </span>
    )
  })
}

// Cada palabra queda "pegada" (no se parte a mitad de letra al saltar de línea);
// el salto solo puede pasar entre palabras.
function CutoutWord({ word, offset = 0, className = '' }) {
  const words = word.split(' ')
  const starts = words.reduce((acc, w) => {
    const prev = acc.length ? acc[acc.length - 1].end : offset
    acc.push({ start: prev, end: prev + w.length })
    return acc
  }, [])

  return (
    <div className={`${styles.word} ${className}`}>
      {words.map((w, wi) => (
        <span key={wi} className={styles.wordGroup}>
          <CutoutLetters letters={w.split('')} offset={starts[wi].start} />
        </span>
      ))}
    </div>
  )
}

function Star({ top, left, size, color, delay, duration, rotate }) {
  return (
    <svg
      className={styles.star}
      style={{ top, left, width: size, height: size, '--delay': `${delay}s`, '--dur': `${duration}s`, '--rot0': `${rotate}deg` }}
      viewBox="0 0 51 48"
      aria-hidden
    >
      <path d={STAR_PATH} fill={color} />
    </svg>
  )
}

export default function Suerte() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')}>← volver</button>

      <div className={styles.card}>
        <div className={styles.paperGrain} aria-hidden />
        <div className={styles.fold} aria-hidden />

        {/* ── estrellas decorativas ── */}
        <Star top="4%"  left="8%"  size={26} color="#8a2332" delay={0}    duration={3.4} rotate={-10} />
        <Star top="8%"  left="78%" size={20} color="#c8c4b8" delay={0.6}  duration={2.8} rotate={12} />
        <Star top="20%" left="88%" size={30} color="#8a2332" delay={0.2}  duration={3.8} rotate={-6} />
        <Star top="46%" left="4%"  size={18} color="#e6ac36" delay={1.1}  duration={3.1} rotate={8} />
        <Star top="60%" left="90%" size={22} color="#33685a" delay={0.4}  duration={3.6} rotate={-14} />
        <Star top="80%" left="10%" size={24} color="#c8c4b8" delay={0.9}  duration={3.0} rotate={10} />
        <Star top="88%" left="80%" size={20} color="#8a2332" delay={0.3}  duration={2.6} rotate={-8} />

        <CutoutWord word="EVERYTHING" offset={0} className={styles.topText} />

        <motion.div
          className={styles.heartWrap}
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
              <path d={HEART_PATH} />
            </clipPath>
          </svg>
          <div className={styles.heartBg} />
          <div className={styles.heartPhoto}>
            <img src="/photos/clau-entrevista.jpg" alt="" draggable={false} />
          </div>
          <div className={styles.heartShine} aria-hidden />
        </motion.div>

        <div className={styles.bottomText}>
          <CutoutWord word="IS WORKING" offset={10} />
          <CutoutWord word="OUT FOR YOU" offset={22} />
        </div>
      </div>

      <motion.button
        className={styles.cta}
        onClick={() => setOpen(true)}
        animate={{ scale: [1, 1.05, 1], boxShadow: ['0 6px 0 #5c1620', '0 3px 0 #5c1620', '0 6px 0 #5c1620'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.94, y: 3 }}
      >
        ✨ toca aquí, mi amor ✨
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className={styles.modalBox}
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.modalClose} onClick={() => setOpen(false)}>✕</button>

              <p className={styles.modalEyebrow}>antes de tu entrevista…</p>

              <motion.div
                className={styles.modalNoteWrap}
                animate={{ rotate: [-2, 1.5, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img src="/photos/abrazo-nota.png" alt="un abrazo para ti" className={styles.modalNote} draggable={false} />
              </motion.div>

              <p className={styles.modalWish}>🍀 vas a estar increíble, ya lo verás. mucha suerte hoy 🍀</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
