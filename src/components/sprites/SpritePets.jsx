/**
 * SpritePets — monigotes pixel-art autónomos
 *
 * Cada personaje:
 *  - Carga su spritesheet (4×4 = 16 frames)
 *  - Camina autónomamente rebotando en los bordes
 *  - Al hacer clic/tap se selecciona → se puede mover con flechas o D-pad táctil
 *
 * Mix-blend-mode: lighten elimina el fondo negro visualmente hasta que
 * tengas los PNGs con transparencia de remove.bg.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './SpritePets.module.css'

// ─── Config de personajes ─────────────────────────────────────────────────────
export const CHARACTERS = [
  {
    id: 'lorena-beige',
    src: '/sprites/lorena-beige.png',
    cols: 4, rows: 4,
    frameW: 125, frameH: 125,
    border: 11,
    displaySize: 96,
    label: '🧢 Lorena Beige',
  },
  {
    id: 'lorena-leopard',
    src: '/sprites/lorena-leopard.png',
    cols: 4, rows: 4,
    frameW: 125, frameH: 125,
    border: 11,
    displaySize: 96,
    label: '🐆 Lorena Leopardo',
  },
]

const BASE_SPEED     = 1.2
const WANDER_FRAMES  = 180
const FPS_ANIM       = 8
const STEP_KEYS      = 6

// ─── Carga de imagen ──────────────────────────────────────────────────────────
function useImage(src) {
  const [img, setImg] = useState(null)
  useEffect(() => {
    const i = new window.Image()
    i.crossOrigin = 'anonymous'
    i.onload = () => setImg(i)
    i.src = src
    return () => { i.onload = null }
  }, [src])
  return img
}

// ─── Un personaje ─────────────────────────────────────────────────────────────
function SpritePet({ char, containerSize, isSelected, onSelect, stateMapRef }) {
  const canvasRef = useRef(null)
  const img = useImage(char.src)
  const rafRef = useRef(null)
  const selectedRef = useRef(isSelected)

  // Crear estado inicial del personaje y registrarlo en el mapa global
  const petState = useRef(null)
  if (!petState.current) {
    // Usar window dimensions para la posición inicial (containerSize puede ser 0 aún)
    const W = window.innerWidth
    const H = window.innerHeight
    petState.current = {
      x: Math.random() * Math.max(0, W - char.displaySize),
      y: Math.random() * Math.max(0, H - char.displaySize),
      vx: (Math.random() > 0.5 ? 1 : -1) * BASE_SPEED * (0.8 + Math.random() * 0.4),
      vy: (Math.random() > 0.5 ? 1 : -1) * BASE_SPEED * (0.8 + Math.random() * 0.4),
      frame: 0,
      wanderCountdown: WANDER_FRAMES,
      facingLeft: false,
    }
    if (stateMapRef) stateMapRef.current[char.id] = petState.current
  }

  useEffect(() => { selectedRef.current = isSelected }, [isSelected])

  // Teclado
  useEffect(() => {
    if (!isSelected) return
    const onKey = (e) => {
      const s = petState.current
      switch (e.key) {
        case 'ArrowLeft':  s.vx = -STEP_KEYS; s.vy = 0; s.facingLeft = true;  break
        case 'ArrowRight': s.vx =  STEP_KEYS; s.vy = 0; s.facingLeft = false; break
        case 'ArrowUp':    s.vy = -STEP_KEYS; s.vx = 0; break
        case 'ArrowDown':  s.vy =  STEP_KEYS; s.vx = 0; break
        default: return
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isSelected])

  // Loop canvas
  useEffect(() => {
    if (!img || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { cols, rows, frameW, frameH, border, displaySize } = char
    const total = cols * rows
    const interval = 1000 / FPS_ANIM
    let lastTime = 0

    canvas.width  = displaySize
    canvas.height = displaySize

    // Pre-renderizar frames en offscreen canvas
    // Si getImageData falla por CORS, usamos mix-blend-mode como fallback
    const frameSize = frameW - border * 2
    const offAll = document.createElement('canvas')
    offAll.width  = displaySize
    offAll.height = displaySize * total
    const offCtx = offAll.getContext('2d', { willReadFrequently: true })

    for (let f = 0; f < total; f++) {
      const col = f % cols
      const row = Math.floor(f / cols)
      offCtx.drawImage(img,
        col * frameW + border, row * frameH + border,
        frameSize, frameSize,
        0, f * displaySize, displaySize, displaySize
      )
    }

    // Eliminar fondo oscuro — umbral bajo para no borrar ropa/pelo oscuro
    try {
      const imgData = offCtx.getImageData(0, 0, displaySize, displaySize * total)
      const d = imgData.data
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2]
        const brightness = (r + g + b) / 3
        // Solo eliminar píxeles muy oscuros Y con poca saturación (fondo negro/gris)
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const saturation = max === 0 ? 0 : (max - min) / max
        if (brightness < 15) {
          d[i+3] = 0
        } else if (brightness < 25 && saturation < 0.3) {
          d[i+3] = Math.round((brightness / 25) * 255)
        }
      }
      offCtx.putImageData(imgData, 0, 0)
    } catch(e) {
      console.warn('[SpritePets] getImageData bloqueado:', e.message)
      canvas.style.mixBlendMode = 'screen'
    }

    function loop(ts) {
      const s = petState.current
      const W = containerSize.w
      const H = containerSize.h

      // Movimiento autónomo
      if (!selectedRef.current) {
        s.wanderCountdown--
        if (s.wanderCountdown <= 0) {
          const angle = Math.random() * Math.PI * 2
          s.vx = Math.cos(angle) * BASE_SPEED * (0.8 + Math.random() * 0.4)
          s.vy = Math.sin(angle) * BASE_SPEED * (0.8 + Math.random() * 0.4)
          s.wanderCountdown = WANDER_FRAMES + Math.floor(Math.random() * 120)
        }
      }

      s.x += s.vx
      s.y += s.vy

      // Rebote
      if (s.x < 0)               { s.x = 0;               s.vx = Math.abs(s.vx);  s.facingLeft = false }
      if (s.x > W - displaySize) { s.x = W - displaySize;  s.vx = -Math.abs(s.vx); s.facingLeft = true  }
      if (s.y < 0)               { s.y = 0;               s.vy = Math.abs(s.vy)  }
      if (s.y > H - displaySize) { s.y = H - displaySize;  s.vy = -Math.abs(s.vy) }

      if (s.vx < -0.1) s.facingLeft = true
      if (s.vx >  0.1) s.facingLeft = false

      canvas.style.left = `${s.x}px`
      canvas.style.top  = `${s.y}px`

      // Dibuja frame
      if (ts - lastTime >= interval) {
        lastTime = ts
        const col = s.frame % cols
        const row = Math.floor(s.frame / cols)

        ctx.clearRect(0, 0, displaySize, displaySize)

        // Copiar frame pre-procesado (sin fondo negro) del cache
        if (s.facingLeft) {
          ctx.save()
          ctx.translate(displaySize, 0)
          ctx.scale(-1, 1)
        }
        ctx.drawImage(offAll,
          0, s.frame * displaySize, displaySize, displaySize,
          0, 0, displaySize, displaySize
        )
        if (s.facingLeft) ctx.restore()

        s.frame = (s.frame + 1) % total
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [img, char, containerSize])

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.pet} ${isSelected ? styles.petSelected : ''}`}
      style={{ width: char.displaySize, height: char.displaySize }}
      onClick={() => onSelect(char.id)}
      title={char.label}
    />
  )
}

// ─── D-pad ────────────────────────────────────────────────────────────────────
function DPad({ stateMapRef }) {
  const press = (dir) => {
    // Buscar el personaje seleccionado en el mapa
    // El mapa ya tiene referencia al estado activo, el padre pasa el id seleccionado
    // Usamos el ref directo que nos pasó el padre
    const map = stateMapRef.current
    const selectedEntry = Object.values(map).find(s => s._selected)
    if (!selectedEntry) return
    switch (dir) {
      case 'left':  selectedEntry.vx = -STEP_KEYS; selectedEntry.vy = 0; selectedEntry.facingLeft = true;  break
      case 'right': selectedEntry.vx =  STEP_KEYS; selectedEntry.vy = 0; selectedEntry.facingLeft = false; break
      case 'up':    selectedEntry.vy = -STEP_KEYS; selectedEntry.vx = 0; break
      case 'down':  selectedEntry.vy =  STEP_KEYS; selectedEntry.vx = 0; break
    }
  }

  return (
    <div className={styles.dpad} aria-label="D-pad táctil">
      <button className={`${styles.dpadBtn} ${styles.dpadUp}`}    onPointerDown={() => press('up')}    aria-label="Arriba">▲</button>
      <button className={`${styles.dpadBtn} ${styles.dpadLeft}`}  onPointerDown={() => press('left')}  aria-label="Izquierda">◀</button>
      <div    className={styles.dpadCenter} />
      <button className={`${styles.dpadBtn} ${styles.dpadRight}`} onPointerDown={() => press('right')} aria-label="Derecha">▶</button>
      <button className={`${styles.dpadBtn} ${styles.dpadDown}`}  onPointerDown={() => press('down')}  aria-label="Abajo">▼</button>
    </div>
  )
}

// ─── Contenedor ───────────────────────────────────────────────────────────────
export default function SpritePets({ characters = CHARACTERS, className = '' }) {
  const containerRef = useRef(null)
  // Usar window size directamente — el contenedor es siempre fixed 100dvw x 100dvh
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  const [selectedId, setSelectedId] = useState(null)
  const stateMapRef = useRef({})

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleSelect = useCallback((id) => {
    setSelectedId(prev => {
      const next = prev === id ? null : id
      // Marcar en el estado qué personaje está seleccionado (para D-pad)
      Object.entries(stateMapRef.current).forEach(([key, s]) => {
        s._selected = key === next
      })
      return next
    })
  }, [])

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      {size.w > 0 && characters.map(char => (
        <SpritePet
          key={char.id}
          char={char}
          containerSize={size}
          isSelected={selectedId === char.id}
          onSelect={handleSelect}
          stateMapRef={stateMapRef}
        />
      ))}

      {selectedId && (
        <div className={styles.selectedHint}>
          <span>⬆⬇⬅➡ para mover · tap para soltar</span>
        </div>
      )}

      {selectedId && <DPad stateMapRef={stateMapRef} />}
    </div>
  )
}