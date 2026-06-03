import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './SpritePets.module.css'

// ─── Config ───────────────────────────────────────────────────────────────────
export const CHARACTERS = [
  {
    id: 'lorena-beige',
    src: '/sprites/lorena-beige.png',
    cols: 4, rows: 4, frameW: 125, frameH: 125,
    border: 14, displaySize: 96,
    label: '🧢 Lorena Beige',
  },
  {
    id: 'lorena-leopard',
    src: '/sprites/lorena-leopard.png',
    cols: 4, rows: 4, frameW: 125, frameH: 125,
    border: 14, displaySize: 96,
    label: '🐆 Lorena Leopardo',
  },
]

const BASE_SPEED    = 1.2
const WANDER_FRAMES = 180
const FPS_ANIM      = 8
const STEP_KEYS     = 6
const HUG_DURATION  = 2000   // ms que duran juntos
const HUG_DIST      = 60     // px de distancia para detectar colisión

// ─── Corazón pixel art (dibujado en canvas) ──────────────────────────────────
const HEART_PIXELS = [
  [0,1,1,0,1,1,0],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [0,1,1,1,1,1,0],
  [0,0,1,1,1,0,0],
  [0,0,0,1,0,0,0],
]
const HEART_COLORS = ['#ff2d78','#ff6fa8','#ff0044','#ffaacc','#ff10c8']

function drawPixelHeart(ctx, x, y, size, color) {
  const px = size / 7
  for (let row = 0; row < HEART_PIXELS.length; row++) {
    for (let col = 0; col < HEART_PIXELS[row].length; col++) {
      if (HEART_PIXELS[row][col]) {
        ctx.fillStyle = color
        ctx.fillRect(
          Math.round(x + col * px),
          Math.round(y + row * px),
          Math.ceil(px), Math.ceil(px)
        )
      }
    }
  }
}

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

// ─── Canvas de corazones flotantes ───────────────────────────────────────────
function HeartsCanvas({ heartsRef }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const hearts = heartsRef.current
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i]
        h.y  -= h.vy
        h.x  += h.vx * Math.sin(h.age * 0.05)
        h.age++
        h.alpha = Math.max(0, 1 - h.age / h.life)
        if (h.age > h.life) { hearts.splice(i, 1); continue }
        ctx.save()
        ctx.globalAlpha = h.alpha
        drawPixelHeart(ctx, h.x, h.y, h.size, h.color)
        ctx.restore()
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [heartsRef])

  return createPortal(
    <canvas ref={canvasRef} className={styles.heartsCanvas} />,
    document.body
  )
}

function spawnHearts(heartsRef, cx, cy, count = 8) {
  for (let i = 0; i < count; i++) {
    heartsRef.current.push({
      x:     cx + (Math.random() - 0.5) * 60,
      y:     cy + (Math.random() - 0.5) * 20,
      vx:    (Math.random() - 0.5) * 0.8,
      vy:    1.2 + Math.random() * 1.5,
      size:  8 + Math.random() * 12,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      age:   0,
      life:  50 + Math.random() * 40,
      alpha: 1,
    })
  }
}

// ─── Un personaje ─────────────────────────────────────────────────────────────
function SpritePet({ char, containerSize, isSelected, onSelect, stateMapRef }) {
  const canvasRef  = useRef(null)
  const img        = useImage(char.src)
  const rafRef     = useRef(null)
  const selectedRef = useRef(isSelected)

  const petState = useRef(null)
  if (!petState.current) {
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
      hugging: false,
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
    const { cols, frameW, frameH, border, displaySize } = char
    const total = cols * char.rows
    const interval = 1000 / FPS_ANIM
    let lastTime = 0

    canvas.width  = displaySize
    canvas.height = displaySize

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

    try {
      const imgData = offCtx.getImageData(0, 0, displaySize, displaySize * total)
      const d = imgData.data
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2]
        const brightness = (r + g + b) / 3
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const saturation = max === 0 ? 0 : (max - min) / max
        if (brightness < 15) d[i+3] = 0
        else if (brightness < 25 && saturation < 0.3) d[i+3] = Math.round((brightness / 25) * 255)
      }
      offCtx.putImageData(imgData, 0, 0)
    } catch(e) {
      canvas.style.mixBlendMode = 'screen'
    }

    function loop(ts) {
      const s = petState.current
      const W = containerSize.w
      const H = containerSize.h

      if (!s.hugging) {
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

        if (s.x < 0)               { s.x = 0;               s.vx = Math.abs(s.vx);  s.facingLeft = false }
        if (s.x > W - displaySize) { s.x = W - displaySize;  s.vx = -Math.abs(s.vx); s.facingLeft = true  }
        if (s.y < 0)               { s.y = 0;               s.vy = Math.abs(s.vy)  }
        if (s.y > H - displaySize) { s.y = H - displaySize;  s.vy = -Math.abs(s.vy) }

        if (s.vx < -0.1) s.facingLeft = true
        if (s.vx >  0.1) s.facingLeft = false
      }

      canvas.style.left = `${s.x}px`
      canvas.style.top  = `${s.y}px`

      if (ts - lastTime >= interval) {
        lastTime = ts
        ctx.clearRect(0, 0, displaySize, displaySize)
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
function DPad({ stateMapRef, onShoot }) {
  const handlePress = (dir) => (e) => {
    e.preventDefault()
    e.stopPropagation()
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
      <button className={`${styles.dpadBtn} ${styles.dpadUp}`}    onTouchStart={handlePress('up')}    onMouseDown={handlePress('up')}    aria-label="Arriba">▲</button>
      <button className={`${styles.dpadBtn} ${styles.dpadLeft}`}  onTouchStart={handlePress('left')}  onMouseDown={handlePress('left')}  aria-label="Izquierda">◀</button>
      <button className={`${styles.dpadBtn} ${styles.dpadCenter}`}
        onTouchStart={(e) => { e.preventDefault(); onShoot() }}
        onMouseDown={(e)  => { e.preventDefault(); onShoot() }}
        aria-label="Disparar corazones"
      >💗</button>
      <button className={`${styles.dpadBtn} ${styles.dpadRight}`} onTouchStart={handlePress('right')} onMouseDown={handlePress('right')} aria-label="Derecha">▶</button>
      <button className={`${styles.dpadBtn} ${styles.dpadDown}`}  onTouchStart={handlePress('down')}  onMouseDown={handlePress('down')}  aria-label="Abajo">▼</button>
    </div>
  )
}

// ─── Contenedor ───────────────────────────────────────────────────────────────
export default function SpritePets({ characters = CHARACTERS, className = '' }) {
  const containerRef = useRef(null)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  const [selectedId, setSelectedId] = useState(null)
  const stateMapRef = useRef({})
  const heartsRef   = useRef([])
  const hugTimerRef = useRef(null)

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // ── Detección de colisión entre seleccionado y otros ──────────────────────
  useEffect(() => {
    if (!selectedId) return
    let rafId
    function checkCollision() {
      const map = stateMapRef.current
      const sel = map[selectedId]
      if (!sel) return
      Object.entries(map).forEach(([id, other]) => {
        if (id === selectedId) return
        if (sel.hugging || other.hugging) return
        const dx = (sel.x + 48) - (other.x + 48)
        const dy = (sel.y + 48) - (other.y + 48)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < HUG_DIST) {
          sel.hugging   = true
          other.hugging = true
          sel.vx = 0; sel.vy = 0
          other.vx = 0; other.vy = 0

          const cx = (sel.x + other.x) / 2 + 48
          const cy = (sel.y + other.y) / 2 + 48
          const burstInterval = setInterval(() => {
            spawnHearts(heartsRef, cx, cy, 5)
          }, 200)

          clearTimeout(hugTimerRef.current)
          const selId   = selectedId
          const otherId = id
          hugTimerRef.current = setTimeout(() => {
            clearInterval(burstInterval)
            const map = stateMapRef.current
            const s1  = map[selId]
            const s2  = map[otherId]
            if (s1) {
              s1.hugging = false
              s1.vx = BASE_SPEED * (Math.random() > 0.5 ? 1 : -1)
              s1.vy = BASE_SPEED * (Math.random() > 0.5 ? 1 : -1)
            }
            if (s2) {
              s2.hugging = false
              s2.vx = s1 ? -s1.vx : BASE_SPEED
              s2.vy = s1 ? -s1.vy : BASE_SPEED
            }
          }, HUG_DURATION)
        }
      })
      rafId = requestAnimationFrame(checkCollision)
    }
    rafId = requestAnimationFrame(checkCollision)
    return () => cancelAnimationFrame(rafId)
  }, [selectedId])

  // ── Disparo manual (espacio) ──────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && selectedId) {
        e.preventDefault()
        const s = stateMapRef.current[selectedId]
        if (s) spawnHearts(heartsRef, s.x + 48, s.y + 48, 12)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  const handleShoot = useCallback(() => {
    if (!selectedId) return
    const s = stateMapRef.current[selectedId]
    if (s) spawnHearts(heartsRef, s.x + 48, s.y + 48, 12)
  }, [selectedId])

  const handleSelect = useCallback((id) => {
    setSelectedId(prev => {
      const next = prev === id ? null : id
      Object.entries(stateMapRef.current).forEach(([key, s]) => {
        s._selected = key === next
      })
      return next
    })
  }, [])

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <HeartsCanvas heartsRef={heartsRef} />

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
          <span>⬆⬇⬅➡ mover · espacio 💗 · tap para soltar</span>
        </div>
      )}

      {selectedId && <DPad stateMapRef={stateMapRef} onShoot={handleShoot} />}
    </div>
  )
}