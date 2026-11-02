import styles from './Cita6Nov.module.css'

// Cartel de serigrafía en rojos y negro. Todo vive en un lienzo de 375×812
// (la misma proporción que el póster HTML que lo envuelve).

const INK = '#0a0204'
const NIGHT = '#14040a'
const WINE = '#4a0a12'
const OX = '#7d0f1b'
const SKIN = '#8f1420'
const RED = '#d4141f'
const HOT = '#ff3b2f'
const CREAM = '#f2e0c4'

const CX = 190
const CY = 500

// Rayos de fondo (cuñas alternas) que salen del disco
const WEDGES = []
for (let i = 0; i < 24; i += 2) {
  const a1 = (i * 15 * Math.PI) / 180
  const a2 = ((i + 1) * 15 * Math.PI) / 180
  const R = 900
  WEDGES.push(
    `M${CX} ${CY} L${(CX + R * Math.cos(a1)).toFixed(1)} ${(CY + R * Math.sin(a1)).toFixed(1)} L${(CX + R * Math.cos(a2)).toFixed(1)} ${(CY + R * Math.sin(a2)).toFixed(1)} Z`,
  )
}

// Rejilla en diagonal del disco
const LATTICE = []
for (let k = -300; k <= 300; k += 24) {
  LATTICE.push(`M${CX - 150 + k} ${CY - 150} L${CX + 150 + k} ${CY + 150}`)
  LATTICE.push(`M${CX + 150 + k} ${CY - 150} L${CX - 150 + k} ${CY + 150}`)
}

// Estrella de ocho puntas
function star8(cx, cy, R, r) {
  const pts = []
  for (let i = 0; i < 16; i++) {
    const rad = i % 2 ? r : R
    const a = (Math.PI * 2 * i) / 16 - Math.PI / 2
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

// Fases de la luna: nueva, creciente, cuarto, gibosa, llena
function moonPath(cx, cy, r, phase) {
  if (phase === 4) return `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r} Z`
  const rx = [0, 0.55 * r, 0, 0.55 * r][phase]
  const sw = phase === 3 ? 1 : 0
  return `M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} A${rx} ${r} 0 0 ${sw} ${cx} ${cy - r} Z`
}

export function PosterArt() {
  return (
    <svg className={styles.art} viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="pa-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#3b0a13" />
          <stop offset="1" stopColor={NIGHT} />
        </radialGradient>
        <clipPath id="pa-disc">
          <circle cx={CX} cy={CY} r="150" />
        </clipPath>
        <filter id="pa-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* fondo + rayos */}
      <rect width="375" height="812" fill="url(#pa-glow)" />
      {WEDGES.map((d, i) => (
        <path key={i} d={d} fill="#1d060c" />
      ))}

      {/* disco-rejilla */}
      <g className={styles.discSpin}>
        <circle cx={CX} cy={CY} r="150" fill={OX} />
        <g clipPath="url(#pa-disc)" stroke={NIGHT} strokeWidth="2.6" fill="none">
          {LATTICE.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
      <circle cx={CX} cy={CY} r="150" fill="none" stroke={RED} strokeWidth="5" />
      <circle cx={CX} cy={CY} r="163" fill="none" stroke={WINE} strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />

      <g transform="translate(0 24)">
        {/* ── pin-up ── */}
        {/* melena */}
        <g fill={INK}>
          <circle cx="135" cy="430" r="70" />
          <circle cx="80" cy="470" r="55" />
          <circle cx="60" cy="540" r="52" />
          <circle cx="190" cy="455" r="55" />
          <circle cx="205" cy="520" r="45" />
          <circle cx="110" cy="400" r="45" />
          <circle cx="165" cy="395" r="42" />
        </g>
        <g fill="none" stroke="#2a0a10" strokeWidth="3" strokeLinecap="round">
          <path d="M70 430 Q100 380 156 392" />
          <path d="M40 520 Q36 470 70 446" />
          <path d="M214 480 Q226 520 206 560" />
        </g>

        {/* cuerpo */}
        <path d="M4 800 Q14 650 108 636 L162 636 Q256 650 268 800 Z" fill={SKIN} />
        <path d="M112 560 L108 646 L162 646 L158 560 Z" fill="#6a0e18" />
        <path d="M4 800 L4 702 Q70 668 135 692 Q200 668 268 702 L268 800 Z" fill={INK} />
        <path d="M8 706 Q70 672 135 696 Q200 672 264 706" fill="none" stroke={HOT} strokeWidth="2.6" strokeLinecap="round" />

        {/* brazo con la copa */}
        <path d="M214 668 Q252 620 226 572" fill="none" stroke={SKIN} strokeWidth="20" strokeLinecap="round" />
        {/* box de kebab: durum asomando, vapor y caja abierta */}
        <g transform="translate(224 565) scale(1.3) translate(-224 -565)">
          <g fill="none" stroke={CREAM} strokeWidth="2.2" strokeLinecap="round" opacity="0.7">
            <path d="M212 476 Q206 468 212 460 Q218 452 212 444" />
            <path d="M232 470 Q226 462 232 454 Q238 446 232 438" />
          </g>
          <path d="M187 511 L203 507 L198 524 Z" fill={OX} />
          <path d="M261 511 L245 507 L250 524 Z" fill={OX} />
          <path d="M201 524 L206 503 H242 L247 524 Z" fill={RED} />
          {/* durum */}
          <g transform="rotate(14 226 506)">
            <rect x="216" y="484" width="21" height="42" rx="10" fill={CREAM} />
            <path d="M219 492 Q226 487 234 492" fill="none" stroke={OX} strokeWidth="2" strokeLinecap="round" />
            <path d="M219 500 L234 500 M219 508 L234 508" stroke={OX} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M217 486 Q221 478 226 484 Q231 477 236 486 Z" fill={HOT} />
          </g>
          {/* relleno */}
          <circle cx="210" cy="518" r="5.5" fill={HOT} />
          <circle cx="240" cy="517" r="5" fill={HOT} />
          <path d="M203 524 Q208 512 216 520 Q222 510 230 520 Q238 510 246 524 Z" fill={SKIN} />
          {/* caja */}
          <path d="M197 523 H251 L241 565 H207 Z" fill={HOT} />
          <path d="M199 534 H249" stroke={NIGHT} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="224" cy="548" r="7.5" fill={NIGHT} />
          <path d="M224 541.5 Q225.5 546.5 230.5 548 Q225.5 549.5 224 554.5 Q222.5 549.5 217.5 548 Q222.5 546.5 224 541.5 Z" fill={HOT} />
        </g>
        <circle cx="226" cy="570" r="11" fill={SKIN} />

        {/* cara */}
        <ellipse cx="135" cy="520" rx="41" ry="52" fill={SKIN} />
        <path d="M150 482 Q172 500 166 548 Q150 560 142 548 Q160 520 150 482 Z" fill="#b21d28" opacity="0.55" />
        <path d="M92 500 Q100 455 140 452 Q180 452 182 498 Q160 472 130 480 Q108 486 92 500 Z" fill={INK} />
        {/* antifaz rojo */}
        <path d="M96 520 Q116 506 136 518 Q156 506 176 520 L172 536 Q154 528 136 536 Q118 528 100 536 Z" fill={HOT} />
        <path d="M104 524 Q116 517 128 524 Q116 531 104 524 Z" fill={INK} />
        <path d="M144 524 Q156 517 168 524 Q156 531 144 524 Z" fill={INK} />
        <path d="M104 524 L95 517 M168 524 L177 517" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M100 506 Q116 494 130 504 M140 504 Q156 494 172 506" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
        <path d="M135 538 L131 558 Q135 562 141 558" fill="none" stroke="#5e0c16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M114 574 Q125 563 135 569 Q145 563 156 574 Q135 594 114 574 Z" fill={HOT} />
        <path d="M116 575 Q135 579 154 575" fill="none" stroke={INK} strokeWidth="1.7" />
        <circle cx="161" cy="562" r="1.9" fill={INK} />
        <circle cx="92" cy="566" r="11" fill="none" stroke={HOT} strokeWidth="4" />
        <circle cx="178" cy="566" r="11" fill="none" stroke={HOT} strokeWidth="4" />

        {/* sombrero de padrino ladeado */}
        <g transform="translate(94 396) rotate(-16)">
          <ellipse cx="0" cy="0" rx="76" ry="15" fill="#a30f1a" />
          <path d="M-46 -2 Q-50 -54 -6 -56 Q42 -54 46 -2 Z" fill={RED} />
          <path d="M-30 -50 Q-6 -40 30 -50" fill="none" stroke="#a30f1a" strokeWidth="3" strokeLinecap="round" />
          <path d="M-47 -14 Q0 -6 47 -14 L45 -2 Q0 6 -45 -2 Z" fill={INK} />
        </g>

        {/* rosa en el pelo */}
        <g transform="translate(196 424) rotate(18)">
          <ellipse cx="-17" cy="8" rx="12" ry="5" transform="rotate(-24 -17 8)" fill={OX} />
          <ellipse cx="17" cy="8" rx="12" ry="5" transform="rotate(24 17 8)" fill={OX} />
          <circle r="15" fill={HOT} />
          <path d="M0 0 m-3 0 a3 3 0 1 1 3 3 a6 6 0 1 1 -6 -6 a9 9 0 1 1 9 9 a12 12 0 1 1 -12 -12" fill="none" stroke={SKIN} strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* ── saxofón con ojo ── */}
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M297 340 Q294 298 330 292" stroke={SKIN} strokeWidth="19" />
          <path d="M297 340 Q294 298 330 292" stroke={RED} strokeWidth="13" />
          <path d="M330 292 L364 285" stroke={INK} strokeWidth="13" />
          <path d="M348 289 L352 288" stroke={CREAM} strokeWidth="3" />
        </g>
        <path d="M279 336 Q275 470 270 566 Q268 606 258 634 L346 634 Q338 606 334 566 Q322 470 316 336 Z" fill={SKIN} />
        <path d="M279 336 Q275 470 270 566 Q268 606 258 634 L318 634 Q312 604 308 566 Q302 470 300 336 Z" fill={RED} />
        <path d="M284 340 Q280 470 277 566" fill="none" stroke={HOT} strokeWidth="4" strokeLinecap="round" />
        <g fill={OX} stroke={INK} strokeWidth="2.4">
          <circle cx="290" cy="400" r="7.5" />
          <circle cx="288" cy="452" r="7.5" />
          <circle cx="286" cy="504" r="8" />
          <circle cx="284" cy="556" r="8.5" />
        </g>
        <g stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M298 400 H326 M296 452 H328 M294 504 H330 M292 556 H334" />
          <path d="M300 340 Q304 470 312 600" stroke={WINE} strokeWidth="2" />
        </g>
        <path d="M264 596 H330" stroke={INK} strokeWidth="3.4" />
        <ellipse cx="297" cy="646" rx="60" ry="30" fill={HOT} />
        <ellipse cx="297" cy="648" rx="51" ry="23" fill={INK} />
        {/* el ojo */}
        <path d="M260 648 Q297 624 334 648 Q297 672 260 648 Z" fill={CREAM} />
        <g className={styles.iris}>
          <circle cx="297" cy="648" r="12" fill={HOT} />
          <circle cx="297" cy="648" r="5" fill={INK} />
          <circle cx="301" cy="644" r="2.2" fill={CREAM} />
        </g>
        <path d="M260 648 Q297 624 334 648" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* misticismo: lunas, estrellas, chispas */}
      <g>
        {[0, 1, 2, 3, 4].map((p) => (
          <g key={p}>
            <circle cx={38 + p * 25} cy="318" r="8.5" fill="none" stroke={HOT} strokeWidth="1.6" />
            <path d={moonPath(38 + p * 25, 318, 8.5, p)} fill={HOT} />
          </g>
        ))}
        <polygon points={star8(26, 372, 11, 5.2)} fill="none" stroke={HOT} strokeWidth="1.8" strokeLinejoin="round" className={styles.twinkle} />
        <polygon points={star8(350, 372, 9, 4.4)} fill="none" stroke={RED} strokeWidth="1.8" strokeLinejoin="round" className={styles.twinkle2} />
        <path d="M240 340 Q243 350 253 352 Q243 354 240 364 Q237 354 227 352 Q237 350 240 340 Z" fill={HOT} className={styles.twinkle} />
        <path d="M62 700 Q64 706 70 708 Q64 710 62 716 Q60 710 54 708 Q60 706 62 700 Z" fill={HOT} className={styles.twinkle2} />
      </g>

      {/* bloque de la fecha */}
      <path d="M262 812 L262 744 Q262 720 286 720 L375 720 L375 812 Z" fill={HOT} />

      {/* teclas de piano / rejilla inferior */}
      <g>
        {Array.from({ length: 24 }).map((_, i) => (
          <rect
            key={i}
            x={10 + i * 10.5}
            y={i % 3 === 0 ? 790 : 796}
            width="6"
            height={i % 3 === 0 ? 16 : 10}
            fill={i % 4 === 0 ? CREAM : i % 2 ? HOT : OX}
          />
        ))}
      </g>

      {/* marco */}
      <rect x="7" y="7" width="361" height="798" fill="none" stroke={CREAM} strokeOpacity="0.4" strokeWidth="1.2" />
      <rect x="11" y="11" width="353" height="790" fill="none" stroke={CREAM} strokeOpacity="0.22" strokeWidth="0.7" />

      {/* grano de impresión */}
      <rect width="375" height="812" filter="url(#pa-grain)" opacity="0.2" style={{ mixBlendMode: 'overlay' }} />
    </svg>
  )
}
