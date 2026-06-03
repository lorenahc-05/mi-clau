import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { dates as builtInDates } from '../data/dates'
import styles from './Dates.module.css'

// ─── iCal export ─────────────────────────────────────────────────────────────
function toICalDate(dateStr) {
  const d = new Date(dateStr)
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function exportToICal(citas) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MiClau//ES',
    'CALSCALE:GREGORIAN',
  ]
  citas.forEach(c => {
    const start = toICalDate(c.isoDate)
    const end   = toICalDate(c.isoDate)
    lines.push(
      'BEGIN:VEVENT',
      `UID:${c.id}@miclau`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${c.title}`,
      `DESCRIPTION:${c.description || ''}`,
      'END:VEVENT'
    )
  })
  lines.push('END:VCALENDAR')
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'mis-citas.ics'; a.click()
  URL.revokeObjectURL(url)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS   = ['L','M','X','J','V','S','D']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  // 0=Sun → convert to Mon-based
  return (new Date(year, month, 1).getDay() + 6) % 7
}

// ─── Modal añadir cita ────────────────────────────────────────────────────────
function AddCitaModal({ onClose, onAdd, selectedDate }) {
  const [title, setTitle]       = useState('')
  const [desc,  setDesc]        = useState('')
  const [date,  setDate]        = useState(selectedDate || '')

  function handleAdd() {
    if (!title.trim() || !date) return
    onAdd({ id: Date.now().toString(), title: title.trim(), description: desc.trim(), isoDate: date })
    onClose()
  }

  return (
    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className={styles.modalBox} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Nueva cita</h2>
        <input  className={styles.modalInput} type="text"  placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
        <input  className={styles.modalInput} type="date"  value={date}  onChange={e => setDate(e.target.value)} />
        <textarea className={styles.modalTextarea} placeholder="Descripción (opcional)" value={desc} onChange={e => setDesc(e.target.value)} />
        <div className={styles.modalActions}>
          <button className={styles.modalCancel} onClick={onClose}>Cancelar</button>
          <button className={styles.modalConfirm} onClick={handleAdd} disabled={!title.trim() || !date}>Añadir</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Calendario ──────────────────────────────────────────────────────────────
function Calendar({ citas, onDayClick }) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const citaDates = useMemo(() => new Set(
    citas.map(c => c.isoDate?.slice(0, 10)).filter(Boolean)
  ), [citas])

  const daysInMonth  = getDaysInMonth(year, month)
  const firstDay     = getFirstDayOfMonth(year, month)
  const cells        = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )

  function prev() { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  function next() { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  return (
    <div className={styles.cal}>
      <div className={styles.calNav}>
        <button className={styles.calNavBtn} onClick={prev}>‹</button>
        <span className={styles.calMonth}>{MONTHS[month]} {year}</span>
        <button className={styles.calNavBtn} onClick={next}>›</button>
      </div>
      <div className={styles.calGrid}>
        {DAYS.map(d => <span key={d} className={styles.calDayLabel}>{d}</span>)}
        {cells.map((day, i) => {
          if (!day) return <span key={`e${i}`} />
          const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const hasCita  = citaDates.has(iso)
          const isToday  = iso === todayStr
          return (
            <button
              key={iso}
              className={`${styles.calDay} ${hasCita ? styles.calDayCita : ''} ${isToday ? styles.calDayToday : ''}`}
              onClick={() => onDayClick(iso)}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function Dates() {
  const navigate = useNavigate()
  const [view,        setView]        = useState('calendar') // calendar | list
  const [showAdd,     setShowAdd]     = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [customCitas, setCustomCitas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('miclau-citas') || '[]') } catch { return [] }
  })

  // Combinar citas del código con las custom (para el calendario usamos las custom + built-in con isoDate)
  const builtInWithDate = builtInDates.filter(d => d.isoDate)
  const allCitas = [...builtInWithDate, ...customCitas]

  function addCita(cita) {
    const updated = [...customCitas, cita]
    setCustomCitas(updated)
    localStorage.setItem('miclau-citas', JSON.stringify(updated))
  }

  function handleDayClick(iso) {
    setSelectedDay(iso)
    setShowAdd(true)
  }

  // Citas del día seleccionado
  const citasDelDia = allCitas.filter(c => c.isoDate?.slice(0,10) === selectedDay)

  return (
    <div className={styles.page}>
      <motion.div className={styles.inner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

        {/* Header */}
        <header className={styles.header}>
          <button className={styles.back} onClick={() => navigate('/')}>← inicio</button>
          <div className={styles.headerRule} />
          <div className={styles.headerBottom}>
            <h1 className={styles.title}>Citas</h1>
            <p className={styles.count}>{builtInDates.length + customCitas.length} plan{(builtInDates.length + customCitas.length) !== 1 ? 'es' : ''}</p>
          </div>
        </header>

        {/* Calendario */}
        <div className={styles.calWrap}>
          <Calendar citas={allCitas} onDayClick={handleDayClick} />

          {/* Botones debajo del calendario */}
          <div className={styles.calActions}>
            <button className={`${styles.calActionBtn} ${view === 'list' ? styles.calActionActive : ''}`} onClick={() => setView(v => v === 'list' ? 'calendar' : 'list')}>
              Ver citas
            </button>
            <button className={styles.calActionBtn} onClick={() => { setSelectedDay(null); setShowAdd(true) }}>
              + Añadir cita
            </button>
            {allCitas.length > 0 && (
              <button className={styles.calActionExport} onClick={() => exportToICal(allCitas.filter(c => c.isoDate))}>
                Exportar a iPhone
              </button>
            )}
          </div>
        </div>

        {/* Lista de citas */}
        <AnimatePresence>
          {view === 'list' && (
            <motion.div
              className={styles.list}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
            >
              {builtInDates.map((date, i) => (
                <DateRow key={date.id} date={date} index={i} onClick={() => navigate(`/citas/${date.id}`)} />
              ))}
              {customCitas.map((cita, i) => (
                <DateRow key={cita.id} date={cita} index={builtInDates.length + i} onClick={() => {}} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* Modal añadir */}
      <AnimatePresence>
        {showAdd && (
          <AddCitaModal
            selectedDate={selectedDay}
            onClose={() => setShowAdd(false)}
            onAdd={addCita}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function DateRow({ date, index, onClick }) {
  return (
    <motion.button className={styles.row} onClick={onClick} whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
      <span className={styles.rowNum}>0{index + 1}</span>
      <div className={styles.rowContent}>
        <div className={styles.rowTop}>
          <span className={styles.rowDate}>{date.isoDate || date.date}</span>
          {date.status === 'open' && <span className={styles.rowBadge}>abierta</span>}
        </div>
        <h2 className={styles.rowTitle}>{date.title}</h2>
        <p className={styles.rowDesc}>{date.description}</p>
      </div>
      <span className={styles.rowArrow}>→</span>
    </motion.button>
  )
}