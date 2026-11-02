import { useId } from 'react'
import styles from './Cita6Nov.module.css'

// Ilustraciones del póster. Todas pintan con `currentColor` (rojo) y "recortan"
// los detalles con el negro del fondo mediante las clases cut / cutFill / cutStroke.

// Estampado de leopardo compartido (los SVG lo usan con fill="url(#cita-leo)")
export function LeoDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <pattern id="cita-leo" width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="#c9121f" />
          <g fill="#ea3a46" stroke="#120305" strokeWidth="2.4" strokeLinecap="round">
            <ellipse cx="8" cy="8" rx="5" ry="3.4" transform="rotate(25 8 8)" strokeDasharray="19 8" />
            <ellipse cx="21" cy="15" rx="4.6" ry="3.2" transform="rotate(-35 21 15)" strokeDasharray="17 8" />
            <ellipse cx="9" cy="21" rx="4.4" ry="3" transform="rotate(70 9 21)" strokeDasharray="16 7.7" />
          </g>
        </pattern>
      </defs>
    </svg>
  )
}

// ── Del primer diseño ─────────────────────────────────────────────────────────
export function Cocktail() {
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

export function Sax() {
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

export function Grid() {
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

export function Padrino() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M6 100 Q8 72 34 66 L50 82 L66 66 Q92 72 94 100 Z" fill="currentColor" />
      <path d="M50 82 L38 66 H62 Z" className={styles.cutFill} />
      <path d="M50 73 L40 67 V79 Z M50 73 L60 67 V79 Z" fill="currentColor" />
      <circle cx="50" cy="73" r="2.6" fill="currentColor" />
      <path d="M34 70 L47 94" className={styles.cut} strokeWidth="2" />
      <path d="M66 70 L53 94" className={styles.cut} strokeWidth="2" />
      <path d="M33 38 Q33 62 50 66 Q67 62 67 38 Z" fill="currentColor" />
      <path d="M44 66 H56 V70 H44 Z" fill="currentColor" />
      <path d="M31 36 Q29 8 50 8 Q71 8 69 36 Z" fill="currentColor" />
      <path d="M30 28 H70" className={styles.cut} strokeWidth="3.4" />
      <path
        d="M12 38 Q50 22 88 38 Q50 48 12 38 Z"
        fill="currentColor"
        className={styles.cutStroke}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
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

// Pin-up de pie: pelo con rulo, mano en la cadera, vestido de leopardo y copa en alto
export function PinUp() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M41 28 Q26 35 30 46 Q33 52 41 50" strokeWidth="4.4" />
        <path d="M59 28 Q72 27 76 17" strokeWidth="4.4" />
        <path d="M57 6 Q68 12 62 24" strokeWidth="4" />
        <path d="M44 84 L41 94 M39 96 L43 96" strokeWidth="4" />
        <path d="M56 84 L60 94 M58 96 L62 96" strokeWidth="4" />
      </g>
      <ellipse cx="50" cy="14" rx="6.4" ry="7.6" fill="currentColor" />
      <circle cx="43" cy="7" r="5" fill="currentColor" />
      <rect x="47" y="19" width="6" height="7" fill="currentColor" />
      <path
        d="M41 25 Q50 22 59 25 Q61 34 57 42 L57 46 Q70 54 77 80 Q50 90 23 80 Q30 54 43 46 L43 42 Q39 34 41 25 Z"
        fill="url(#cita-leo)"
      />
      <path d="M43 28 Q50 35 57 28" className={styles.cut} strokeWidth="2" />
      <path d="M25 80 Q50 88 75 80" className={styles.cut} strokeWidth="2" />
      <path d="M70 5 H84 L77 14 Z M77 14 V19 M73 19 H81" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// Pin-up sentada en una copa de cóctel, con las piernas por fuera
export function PinUpGlass() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M42 44 Q29 42 26 27" strokeWidth="4.6" />
        <path d="M58 45 Q70 52 70 60" strokeWidth="4.6" />
        <path d="M54 64 Q70 57 80 62 L85 82 L79 86" strokeWidth="6" />
        <path d="M56 17 Q68 20 63 32" strokeWidth="3.6" />
      </g>
      <path d="M40 41 H60 Q62 50 56 57 Q60 64 63 70 H37 Q40 64 44 57 Q38 50 40 41 Z" fill="currentColor" />
      <ellipse cx="50" cy="28" rx="6.4" ry="7.6" fill="currentColor" />
      <circle cx="44" cy="20.5" r="4.8" fill="currentColor" />
      <rect x="47.5" y="33" width="5" height="9" fill="currentColor" />
      <path d="M16 6 H36 L26 17 Z M26 17 V25 M22 25 H30" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 66 H88 L50 91 Z" fill="currentColor" className={styles.cutStroke} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M47 90 H53 V96 H47 Z" fill="currentColor" />
      <path d="M32 100 C40 93 60 93 68 100 Z" fill="currentColor" />
    </svg>
  )
}

export function Sparkle() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M50 2 Q54 46 98 50 Q54 54 50 98 Q46 54 2 50 Q46 46 50 2 Z" fill="currentColor" />
    </svg>
  )
}

// Estrella de ocho puntas, solo contorno
export function Star8() {
  const pts = []
  for (let i = 0; i < 16; i++) {
    const r = i % 2 ? 24 : 48
    const a = (Math.PI * 2 * i) / 16 - Math.PI / 2
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`)
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <polygon points={pts.join(' ')} fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  )
}

// ── Nuevas, del estilo póster ─────────────────────────────────────────────────
export function SunFace() {
  const rays = []
  for (let i = 0; i < 16; i++) {
    rays.push(
      <path
        key={i}
        d="M60 3 Q67 13 65 27 L55 27 Q53 13 60 3 Z"
        transform={`rotate(${i * 22.5} 60 60)`}
        fill={i % 2 ? 'currentColor' : '#8e0f1a'}
      />,
    )
  }
  return (
    <svg viewBox="0 0 120 120" aria-hidden>
      <g className={styles.spin}>{rays}</g>
      <circle cx="60" cy="60" r="33" fill="currentColor" />
      <circle cx="60" cy="60" r="28" fill="none" className={styles.cut} strokeWidth="1.6" strokeDasharray="1 5.2" />
      <g className={styles.cut} strokeWidth="2.6">
        <path d="M43 57 Q49 50 55 57" />
        <path d="M65 57 Q71 50 77 57" />
        <path d="M60 57 Q56 65 61 67" strokeWidth="2.2" />
      </g>
      <path d="M51 73 Q60 82 69 73 Q60 77 51 73 Z" className={styles.cutFill} />
      <circle cx="44" cy="67" r="3.4" fill="#8e0f1a" />
      <circle cx="76" cy="67" r="3.4" fill="#8e0f1a" />
    </svg>
  )
}

export function MoonFace() {
  const id = useId()
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <defs>
        <mask id={id}>
          <rect width="100" height="100" fill="#fff" />
          <circle cx="74" cy="40" r="34" fill="#000" />
        </mask>
      </defs>
      <circle cx="46" cy="54" r="42" fill="currentColor" mask={`url(#${id})`} />
      <g className={styles.cut} strokeWidth="2.6">
        <path d="M12 58 Q19 51 26 58" />
        <path d="M17 76 Q24 82 32 74" />
      </g>
      <circle cx="14" cy="68" r="3.2" fill="#8e0f1a" />
      <circle cx="82" cy="78" r="3" fill="currentColor" />
    </svg>
  )
}

// Hoja de monstera: contorno de corazón, nervio central y cortes que llegan al borde
export function Monstera() {
  const id = useId()
  const leaf = 'M52 98 C8 86 2 44 26 20 C34 12 44 8 52 12 C62 6 76 10 84 22 C100 44 94 84 52 98 Z'
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <defs>
        <clipPath id={id}>
          <path d={leaf} />
        </clipPath>
      </defs>
      <path d={leaf} fill="currentColor" />
      <g className={styles.cut} strokeWidth="3.2" clipPath={`url(#${id})`}>
        <path d="M52 14 Q50 56 52 98" strokeWidth="2.4" />
        <path d="M51 34 L8 22" />
        <path d="M50 52 L0 46" />
        <path d="M50 68 L2 74" />
        <path d="M51 82 L20 98" />
        <path d="M52 36 L96 26" />
        <path d="M52 54 L102 52" />
        <path d="M52 70 L98 78" />
        <path d="M52 84 L82 98" />
      </g>
      <g className={styles.cutFill}>
        <ellipse cx="40" cy="42" rx="2.6" ry="4.4" transform="rotate(20 40 42)" />
        <ellipse cx="64" cy="44" rx="2.6" ry="4.4" transform="rotate(-20 64 44)" />
        <ellipse cx="38" cy="62" rx="2.6" ry="4.4" transform="rotate(-18 38 62)" />
        <ellipse cx="66" cy="64" rx="2.6" ry="4.4" transform="rotate(18 66 64)" />
      </g>
    </svg>
  )
}

// Rama de palmera: tallo curvo con hojitas a cada lado
export function Frond() {
  const P0 = [28, 98]
  const C = [14, 48]
  const P1 = [72, 6]
  const leaves = []
  const N = 10
  for (let i = 1; i <= N; i++) {
    const t = i / (N + 1)
    const x = (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * C[0] + t * t * P1[0]
    const y = (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * C[1] + t * t * P1[1]
    const dx = 2 * (1 - t) * (C[0] - P0[0]) + 2 * t * (P1[0] - C[0])
    const dy = 2 * (1 - t) * (C[1] - P0[1]) + 2 * t * (P1[1] - C[1])
    const len = Math.hypot(dx, dy)
    const tx = dx / len
    const ty = dy / len
    const nx = -ty
    const ny = tx
    const L = 26 * (1 - 0.5 * t)
    for (const side of [-1, 1]) {
      const ex = x + side * nx * L + tx * L * 0.55
      const ey = y + side * ny * L + ty * L * 0.55
      leaves.push(
        <path
          key={`${i}${side}`}
          d={`M${x.toFixed(1)} ${y.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`}
          stroke={(i + side) % 2 ? 'currentColor' : '#8e0f1a'}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />,
      )
    }
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      {leaves}
      <path d={`M${P0} Q${C} ${P1}`} stroke="#8e0f1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Candle() {
  return (
    <svg viewBox="0 0 50 110" aria-hidden>
      <g className={styles.flame}>
        <path d="M25 3 Q40 22 25 37 Q10 22 25 3 Z" fill="currentColor" />
        <path d="M25 17 Q32 27 25 34 Q18 27 25 17 Z" fill="#8e0f1a" />
      </g>
      <path d="M25 37 V45" stroke="#8e0f1a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 48 H40 V100 H10 Z" fill="currentColor" />
      <ellipse cx="25" cy="48" rx="15" ry="5" fill="#8e0f1a" />
      <g className={styles.cut} strokeWidth="3">
        <path d="M17 54 V70" />
        <path d="M32 54 V62" />
      </g>
      <path d="M4 100 H46 L42 108 H8 Z" fill="#8e0f1a" />
    </svg>
  )
}

// Corazón con un ojo dentro
export function EyeHeart() {
  return (
    <svg viewBox="0 0 100 92" aria-hidden>
      <path
        d="M50 88 C8 56 2 36 2 24 C2 10 14 2 26 2 C38 2 46 10 50 18 C54 10 62 2 74 2 C86 2 98 10 98 24 C98 36 92 56 50 88 Z"
        fill="currentColor"
      />
      <path d="M17 42 Q50 14 83 42 Q50 70 17 42 Z" className={styles.cutFill} />
      <circle cx="50" cy="42" r="12" fill="currentColor" />
      <circle cx="50" cy="42" r="5.4" className={styles.cutFill} />
      <circle cx="54" cy="38" r="2.2" fill="currentColor" />
      <g className={styles.cut} strokeWidth="2.6">
        <path d="M29 26 L24 17" />
        <path d="M40 20 L37 10" />
        <path d="M50 17 V7" />
        <path d="M60 20 L63 10" />
        <path d="M71 26 L76 17" />
      </g>
    </svg>
  )
}
