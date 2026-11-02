import { useEffect, useState } from 'react'
import styles from './Cita6Nov.module.css'
import { PosterArt } from './Cita6NovArt'

// Viernes 6 de noviembre de 2026 — hora local de quedada
const TARGET = new Date(2026, 10, 6, 16, 0, 0)

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

// posición sobre el lienzo de 375×812, en %
const at = (x, y) => ({ left: `${(x / 3.75).toFixed(2)}%`, top: `${(y / 8.12).toFixed(2)}%` })

export default function Cita6Nov() {
  const [time, setTime] = useState(getRemaining)

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.poster}>
      <div className={styles.stage}>
        <PosterArt />

        <div role="timer" aria-label="Cuenta atrás hasta el 6 de noviembre">
          <div className={styles.days} style={at(12, 36)}>
            <span>{pad(time.days)}</span>
          </div>
          <span className={styles.daysLabel} style={at(20, 224)}>días</span>

          <div className={styles.stack} style={at(268, 42)}>
            <div className={styles.unit}>
              <b>{pad(time.hours)}</b>
              <i>horas</i>
            </div>
            <div className={styles.unit}>
              <b>{pad(time.minutes)}</b>
              <i>min</i>
            </div>
            <div className={styles.unit}>
              <b>{pad(time.seconds)}</b>
              <i>seg</i>
            </div>
          </div>
        </div>

        <p className={styles.band} style={{ top: at(0, 250).top }} aria-hidden>
          <span>tic</span> <span>tac</span> <span>tic</span> <span>tac</span>
        </p>

        <p className={styles.moonNote} style={at(30, 336)}>la noche lo sabe</p>

        <p className={styles.offer} style={at(26, 742)}>
          En mi casa
          <br />
          a las 16.00
        </p>

        <div className={styles.date} style={at(262, 730)}>
          <small>vie</small>
          <b>6</b>
          <small>nov</small>
        </div>
      </div>
    </div>
  )
}
