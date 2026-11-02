import { useEffect, useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './Cita6Nov.module.css'

// Viernes 6 de noviembre de 2026 — hora local de quedada
const TARGET = new Date(2026, 10, 6, 17, 0, 0)

function getRemaining() {
  const diff = Math.max(0, TARGET.getTime() - Date.now())
  const s = Math.floor(diff / 1000)
  return {
    done: diff === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

const pad = (n) => String(n).padStart(2, '0')

// ── Iconos (siluetas negras, detalles recortados en el rojo del fondo) ─────────
function Cocktail() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M68 4 L50 31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 22 H88 L50 60 Z" fill="currentColor" />
      <path d="M22 32 H78" className={styles.cut} strokeWidth="2.4" />
      <circle cx="49" cy="33" r="6.5" fill="currentColor" className={styles.cutStroke} strokeWidth="2.2" />
      <circle cx="49" cy="33" r="2" className={styles.cutFill} />
      <path d="M47 58 H53 V86 H47 Z" fill="currentColor" />
      <path d="M28 93 C36 82 64 82 72 93 Z" fill="currentColor" />
    </svg>
  )
}

function Sax() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13 L22 10" strokeWidth="5" />
        <path d="M22 10 Q38 8 40 28 L40 64 Q40 90 56 90 Q70 90 70 68 L70 58" strokeWidth="10" />
      </g>
      <path d="M56 46 H86 L78 64 H62 Z" fill="currentColor" />
      <path d="M60 51 H82" className={styles.cut} strokeWidth="2.4" />
      <g className={styles.cutFill}>
        <circle cx="40" cy="34" r="2.8" />
        <circle cx="40" cy="46" r="2.8" />
        <circle cx="40" cy="58" r="2.8" />
        <circle cx="70" cy="74" r="2.8" />
      </g>
    </svg>
  )
}

function Grid() {
  const id = useId()
  const lines = []
  for (let k = -80; k <= 180; k += 15) {
    lines.push(<path key={`a${k}`} d={`M${k} 0 L${k + 100} 100`} />)
    lines.push(<path key={`b${k}`} d={`M${k + 100} 0 L${k} 100`} />)
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <defs>
        <clipPath id={id}>
          <circle cx="50" cy="54" r="38" />
        </clipPath>
      </defs>
      <path d="M50 4 V16" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="50" cy="54" r="38" fill="currentColor" />
      <g clipPath={`url(#${id})`} className={styles.cut} strokeWidth="2.2">
        {lines}
      </g>
    </svg>
  )
}

function Padrino() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      {/* hombros / esmoquin */}
      <path d="M6 100 Q8 72 34 66 L50 82 L66 66 Q92 72 94 100 Z" fill="currentColor" />
      {/* camisa y pajarita */}
      <path d="M50 82 L38 66 H62 Z" className={styles.cutFill} />
      <path d="M50 73 L40 67 V79 Z M50 73 L60 67 V79 Z" fill="currentColor" />
      <circle cx="50" cy="73" r="2.6" fill="currentColor" />
      {/* solapa */}
      <path d="M34 70 L47 94" className={styles.cut} strokeWidth="2" />
      <path d="M66 70 L53 94" className={styles.cut} strokeWidth="2" />
      {/* cabeza */}
      <path d="M33 38 Q33 62 50 66 Q67 62 67 38 Z" fill="currentColor" />
      <path d="M44 66 H56 V70 H44 Z" fill="currentColor" />
      {/* sombrero */}
      <path d="M31 36 Q29 8 50 8 Q71 8 69 36 Z" fill="currentColor" />
      <path d="M30 28 H70" className={styles.cut} strokeWidth="3.4" />
      <path
        d="M12 38 Q50 22 88 38 Q50 48 12 38 Z"
        fill="currentColor"
        className={styles.cutStroke}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* rosa en la solapa */}
      <circle cx="71" cy="82" r="6.2" className={styles.cutFill} />
      <path
        d="M71 82 m-2 0 a2 2 0 1 1 2 2 a4 4 0 1 1 -4 -4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Sparkle() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M50 2 Q54 46 98 50 Q54 54 50 98 Q46 54 2 50 Q46 46 50 2 Z" fill="currentColor" />
    </svg>
  )
}

const ICONS = { cocktail: Cocktail, sax: Sax, grid: Grid, padrino: Padrino, sparkle: Sparkle }

// left/top en %, size en px, rot en grados, dur/delay en segundos
const FLOATERS = [
  { t: 'padrino', left: 6, top: 5, size: 96, rot: -8, dur: 6.5, delay: 0 },
  { t: 'sax', left: 70, top: 4, size: 92, rot: 10, dur: 7.2, delay: 0.8 },
  { t: 'cocktail', left: 38, top: 14, size: 70, rot: 6, dur: 5.6, delay: 1.4 },
  { t: 'grid', left: 80, top: 24, size: 66, rot: -6, dur: 6.8, delay: 0.3 },
  { t: 'cocktail', left: 3, top: 26, size: 64, rot: -10, dur: 6, delay: 1.9 },
  { t: 'sax', left: 4, top: 68, size: 84, rot: -12, dur: 7, delay: 0.5 },
  { t: 'padrino', left: 76, top: 66, size: 90, rot: 9, dur: 6.2, delay: 1.2 },
  { t: 'grid', left: 36, top: 76, size: 74, rot: 5, dur: 7.4, delay: 0.1 },
  { t: 'cocktail', left: 66, top: 82, size: 70, rot: -7, dur: 5.8, delay: 2.1 },
  { t: 'padrino', left: 12, top: 84, size: 62, rot: 12, dur: 6.6, delay: 1.6 },
  { t: 'sparkle', left: 24, top: 12, size: 22, rot: 0, dur: 4.2, delay: 0.2 },
  { t: 'sparkle', left: 60, top: 22, size: 16, rot: 0, dur: 3.8, delay: 1.1 },
  { t: 'sparkle', left: 90, top: 50, size: 20, rot: 0, dur: 4.6, delay: 0.6 },
  { t: 'sparkle', left: 6, top: 52, size: 18, rot: 0, dur: 4, delay: 1.7 },
  { t: 'sparkle', left: 52, top: 66, size: 22, rot: 0, dur: 4.4, delay: 0.9 },
  { t: 'sparkle', left: 88, top: 92, size: 16, rot: 0, dur: 3.6, delay: 0.4 },
  { t: 'sparkle', left: 28, top: 94, size: 18, rot: 0, dur: 4.8, delay: 1.3 },
]

const LABELS = [
  ['days', 'días'],
  ['hours', 'horas'],
  ['minutes', 'min'],
  ['seconds', 'seg'],
]

export default function Cita6Nov() {
  const [time, setTime] = useState(getRemaining)
  const reduce = useReducedMotion()

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.floaters} aria-hidden>
        {FLOATERS.map((f, i) => {
          const Icon = ICONS[f.t]
          return (
            <motion.div
              key={i}
              className={styles.floater}
              style={{ left: `${f.left}%`, top: `${f.top}%`, width: f.size, height: f.size }}
              initial={{ rotate: f.rot }}
              animate={
                reduce
                  ? { rotate: f.rot }
                  : f.t === 'sparkle'
                    ? { scale: [0.7, 1.15, 0.7], opacity: [0.55, 1, 0.55], rotate: [0, 20, 0] }
                    : { y: [0, -16, 0], rotate: [f.rot - 5, f.rot + 5, f.rot - 5] }
              }
              transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon />
            </motion.div>
          )
        })}
      </div>

      <main className={styles.center}>
        <div className={styles.countdown} role="timer" aria-label="Cuenta atrás hasta el 6 de noviembre">
          {LABELS.map(([key, label]) => (
            <div key={key} className={styles.cell}>
              <span className={styles.digits}>{pad(time[key])}</span>
              <span className={styles.label}>{label}</span>
            </div>
          ))}
        </div>

        <p className={styles.tick} aria-hidden>
          <span>tic</span> <span>tac</span> <span>tic</span> <span>tac</span>
        </p>
      </main>
    </div>
  )
}
