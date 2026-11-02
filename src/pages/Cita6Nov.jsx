import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './Cita6Nov.module.css'
import {
  LeoDefs,
  Cocktail,
  Sax,
  Grid,
  Padrino,
  PinUp,
  PinUpGlass,
  Sparkle,
  Star8,
  SunFace,
  MoonFace,
  Monstera,
  Frond,
  Candle,
  EyeHeart,
} from './Cita6NovArt'

// Viernes 6 de noviembre de 2026 — hora local de quedada
const TARGET = new Date(2026, 10, 6, 17, 0, 0)

function getRemaining() {
  const diff = Math.max(0, TARGET.getTime() - Date.now())
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

const pad = (n) => String(n).padStart(2, '0')

const ART = {
  sun: SunFace,
  moon: MoonFace,
  monstera: Monstera,
  frond: Frond,
  candle: Candle,
  eyeHeart: EyeHeart,
  cocktail: Cocktail,
  sax: Sax,
  grid: Grid,
  padrino: Padrino,
  pinup: PinUp,
  pinupGlass: PinUpGlass,
  sparkle: Sparkle,
  star8: Star8,
}

const TONES = { hot: '#ff4350', red: '#e0202e', deep: '#a30f1a' }

// left/top/w en % del póster · rot en grados · dur/delay en segundos · flip = espejo
const PIECES = [
  // fila superior
  { t: 'sun', tone: 'hot', left: 5, top: 4, w: 33, dur: 7, delay: 0 },
  { t: 'pinupGlass', tone: 'red', left: 38, top: 5.5, w: 25, rot: 4, dur: 5.8, delay: 1.2 },
  { t: 'moon', tone: 'hot', left: 66, top: 4, w: 28, rot: 8, dur: 6.4, delay: 0.6 },
  // segunda fila
  { t: 'pinup', tone: 'red', left: 4, top: 19.5, w: 26, rot: -6, dur: 6, delay: 1.8, flip: true },
  { t: 'padrino', tone: 'red', left: 35, top: 19.5, w: 29, rot: -3, dur: 6.6, delay: 0.3 },
  { t: 'sax', tone: 'hot', left: 68, top: 18.5, w: 26, rot: 8, dur: 7.2, delay: 0.9 },
  // abajo
  { t: 'monstera', tone: 'deep', left: -3, top: 58, w: 38, rot: -14, dur: 8, delay: 0.4 },
  { t: 'frond', tone: 'deep', left: 62, top: 56.5, w: 40, rot: 16, dur: 8.4, delay: 1.1 },
  { t: 'candle', tone: 'red', left: 44, top: 59, w: 11, dur: 6, delay: 0.2 },
  { t: 'pinup', tone: 'red', left: 30, top: 71.5, w: 27, rot: 4, dur: 6.2, delay: 1.5 },
  { t: 'cocktail', tone: 'hot', left: 5, top: 79, w: 23, rot: -8, dur: 5.6, delay: 2.1 },
  { t: 'grid', tone: 'red', left: 57, top: 75, w: 17, rot: 4, dur: 7.4, delay: 0.7 },
  { t: 'eyeHeart', tone: 'hot', left: 73, top: 75.5, w: 22, rot: 6, dur: 6.8, delay: 1.6 },
  // estrellas
  { t: 'sparkle', tone: 'hot', left: 29, top: 14, w: 5, dur: 3.8, delay: 0.2 },
  { t: 'star8', tone: 'red', left: 61, top: 15.5, w: 7, dur: 4.6, delay: 1.3 },
  { t: 'sparkle', tone: 'hot', left: 90, top: 33, w: 5, dur: 4.2, delay: 0.8 },
  { t: 'star8', tone: 'red', left: 6, top: 35, w: 7, dur: 5, delay: 0.5 },
  { t: 'sparkle', tone: 'hot', left: 86, top: 56, w: 4.5, dur: 3.6, delay: 1.9 },
  { t: 'sparkle', tone: 'hot', left: 10, top: 57, w: 4.5, dur: 4, delay: 1 },
  { t: 'star8', tone: 'red', left: 56, top: 91, w: 6, dur: 4.8, delay: 0.1 },
  { t: 'sparkle', tone: 'hot', left: 35, top: 92, w: 5, dur: 4.4, delay: 1.4 },
  { t: 'sparkle', tone: 'hot', left: 90, top: 93, w: 4, dur: 3.9, delay: 0.6 },
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
      <LeoDefs />
      <div className={styles.poster}>
        <div className={styles.inner} aria-hidden>
          <span className={styles.waveL} />
          <span className={styles.waveR} />
        </div>

        <div className={styles.pieces} aria-hidden>
          {PIECES.map((p, i) => {
            const Art = ART[p.t]
            const rot = p.rot ?? 0
            const twinkle = p.t === 'sparkle' || p.t === 'star8'
            const still = p.t === 'sun'
            return (
              <motion.div
                key={i}
                className={styles.piece}
                style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.w}%`, color: TONES[p.tone] }}
                initial={{ rotate: rot }}
                animate={
                  reduce || still
                    ? { rotate: rot }
                    : twinkle
                      ? { scale: [0.7, 1.2, 0.7], opacity: [0.5, 1, 0.5], rotate: [0, 20, 0] }
                      : { y: [0, -7, 0], rotate: [rot - 3, rot + 3, rot - 3] }
                }
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
              >
                {p.flip ? (
                  <div className={styles.flip}>
                    <Art />
                  </div>
                ) : (
                  <Art />
                )}
              </motion.div>
            )
          })}
        </div>

        <main className={styles.center}>
          <div className={styles.rule} aria-hidden>
            <i />
            <b />
            <i />
          </div>

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
    </div>
  )
}
