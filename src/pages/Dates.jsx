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
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MiClau//ES','CALSCALE:GREGORIAN']
  citas.forEach(c => {
    const start = toICalDate(c.isoDate)
    lines.push('BEGIN:VEVENT',`UID:${c.id}@miclau`,`DTSTART:${start}`,`DTEND:${start}`,`SUMMARY:${c.title}`,`DESCRIPTION:${c.description || ''}`,'END:VEVENT')
  })
  lines.push('END:VCALENDAR')
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'mis-citas.ics'; a.click()
  URL.revokeObjectURL(url)
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS   = ['L','M','X','J','V','S','D']

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) { return (new Date(year, month, 1).getDay() + 6) % 7 }

// ─── Modal añadir cita ────────────────────────────────────────────────────────
function AddCitaModal({ onClose, onAdd, selectedDate }) {
  const [title,     setTitle]     = useState('')
  const [date,      setDate]      = useState(selectedDate || '')
  const [time,      setTime]      = useState('')
  const [place,     setPlace]     = useState('')
  const [desc,      setDesc]      = useState('')
  const [organizer, setOrganizer] = useState('')
  const [surprise,  setSurprise]  = useState(false)
  const [money,     setMoney]     = useState('')
  const [split,     setSplit]     = useState(false)
  const [hasPoll,   setHasPoll]   = useState(false)
  const [pollQ,     setPollQ]     = useState('')
  const [pollOpts,  setPollOpts]  = useState(['','','',''])

  function handleAdd() {
    if (!title.trim() || !date) return
    const cita = {
      id: Date.now().toString(),
      title: title.trim(),
      isoDate: date,
      time: time || null,
      place: place.trim() || null,
      description: desc.trim() || null,
      organizer: organizer.trim() || null,
      surprise,
      money: money.trim() || null,
      split,
      poll: hasPoll ? {
        question: pollQ.trim() || '¿Qué prefieres?',
        options: pollOpts.map(o => o.trim()).filter(Boolean)
      } : null,
    }
    onAdd(cita)
    onClose()
  }

  return (
    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className={styles.modalBox} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Nueva cita</h2>

        <input className={styles.modalInput} type="text" placeholder="Título *" value={title} onChange={e => setTitle(e.target.value)} />
        <div className={styles.modalRow}>
          <input className={styles.modalInput} type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input className={styles.modalInput} type="time" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        <input className={styles.modalInput} type="text" placeholder="Lugar" value={place} onChange={e => setPlace(e.target.value)} />
        <input className={styles.modalInput} type="text" placeholder="Organiza" value={organizer} onChange={e => setOrganizer(e.target.value)} />
        <textarea className={styles.modalTextarea} placeholder="Descripción" value={desc} onChange={e => setDesc(e.target.value)} />

        {/* Sorpresa toggle */}
        <div className={styles.modalToggleRow}>
          <span className={styles.modalToggleLabel}>¿Es sorpresa?</span>
          <button className={`${styles.modalToggle} ${surprise ? styles.modalToggleOn : ''}`} onClick={() => setSurprise(s => !s)}>
            {surprise ? 'SÍ' : 'NO'}
          </button>
        </div>

        {/* Dinero */}
        <div className={styles.modalRow}>
          <input className={styles.modalInput} type="text" placeholder="Coste (ej: ~20€)" value={money} onChange={e => setMoney(e.target.value)} />
          <button className={`${styles.modalToggle} ${split ? styles.modalToggleOn : ''}`} onClick={() => setSplit(s => !s)}>
            {split ? 'A medias' : 'Invitas'}
          </button>
        </div>

        {/* Votación toggle */}
        <div className={styles.modalToggleRow}>
          <span className={styles.modalToggleLabel}>¿Tiene votación?</span>
          <button className={`${styles.modalToggle} ${hasPoll ? styles.modalToggleOn : ''}`} onClick={() => setHasPoll(p => !p)}>
            {hasPoll ? 'SÍ' : 'NO'}
          </button>
        </div>

        {hasPoll && (
          <div className={styles.modalPollWrap}>
            <input className={styles.modalInput} type="text" placeholder="Pregunta" value={pollQ} onChange={e => setPollQ(e.target.value)} />
            {pollOpts.map((opt, i) => (
              <input key={i} className={styles.modalInput} type="text"
                placeholder={`Opción ${String.fromCharCode(65+i)}`}
                value={opt} onChange={e => { const a = [...pollOpts]; a[i] = e.target.value; setPollOpts(a) }} />
            ))}
          </div>
        )}

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

  const citaMap = useMemo(() => {
    const m = {}
    citas.forEach(c => {
      const k = c.isoDate?.slice(0, 10)
      if (k) m[k] = c.surprise ? 'surprise' : 'normal'
    })
    return m
  }, [citas])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfMonth(year, month)
  const cells       = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1)

  function prev() { if (month === 0) { setYear(y => y-1); setMonth(11) } else setMonth(m => m-1) }
  function next() { if (month === 11) { setYear(y => y+1); setMonth(0) } else setMonth(m => m+1) }

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
          const type = citaMap[iso]
          return (
            <button key={iso}
              className={`${styles.calDay} ${type === 'normal' ? styles.calDayCita : ''} ${type === 'surprise' ? styles.calDaySurprise : ''} ${iso === todayStr ? styles.calDayToday : ''}`}
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
  const [view,        setView]        = useState('calendar')
  const [showAdd,     setShowAdd]     = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [customCitas, setCustomCitas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('miclau-citas') || '[]') } catch { return [] }
  })

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

  function handleRowClick(cita) {
    // Si es una cita builtin con tipo especial, navegar a la ruta antigua
    if (builtInDates.find(d => d.id === cita.id)) {
      navigate(`/citas/${cita.id}`)
    } else {
      navigate(`/citas/custom/${cita.id}`)
    }
  }

  return (
    <div className={styles.page}>
      <motion.div className={styles.inner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

        <header className={styles.header}>
          <button className={styles.back} onClick={() => navigate('/')}>← inicio</button>
          <div className={styles.headerRule} />
          <div className={styles.headerBottom}>
            <h1 className={styles.title}>Citas</h1>
            <p className={styles.count}>{allCitas.length} plan{allCitas.length !== 1 ? 'es' : ''}</p>
          </div>
        </header>

        <div className={styles.calWrap}>
          <Calendar citas={allCitas} onDayClick={handleDayClick} />
          <div className={styles.calActions}>
            <button className={`${styles.calActionBtn} ${view === 'list' ? styles.calActionActive : ''}`} onClick={() => setView(v => v === 'list' ? 'calendar' : 'list')}>
              Ver citas
            </button>
            <button className={styles.calActionBtn} onClick={() => { setSelectedDay(null); setShowAdd(true) }}>
              + Añadir cita
            </button>
          </div>
          {allCitas.filter(c => c.isoDate).length > 0 && (
            <button className={styles.calActionExport} onClick={() => exportToICal(allCitas.filter(c => c.isoDate))}>
              Exportar a iPhone 📅
            </button>
          )}
        </div>

        <AnimatePresence>
          {view === 'list' && (
            <motion.div className={styles.list} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3 }}>
              {allCitas.map((cita, i) => (
                <DateRow key={cita.id} date={cita} index={i} onClick={() => handleRowClick(cita)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      <AnimatePresence>
        {showAdd && <AddCitaModal selectedDate={selectedDay} onClose={() => setShowAdd(false)} onAdd={addCita} />}
      </AnimatePresence>
    </div>
  )
}

function DateRow({ date, index, onClick }) {
  return (
    <motion.button className={`${styles.row} ${date.surprise ? styles.rowSurprise : ''}`} onClick={onClick} whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
      <span className={styles.rowNum}>0{index + 1}</span>
      <div className={styles.rowContent}>
        <div className={styles.rowTop}>
          <span className={styles.rowDate}>{date.isoDate || date.date}</span>
          {date.time && <span className={styles.rowTime}>{date.time}</span>}
          {date.surprise && <span className={`${styles.rowBadge} ${styles.rowBadgeSurprise}`}>sorpresa</span>}
          {date.status === 'open' && <span className={styles.rowBadge}>abierta</span>}
        </div>
        <h2 className={`${styles.rowTitle} ${date.surprise ? styles.rowTitleSurprise : ''}`}>{date.title}</h2>
        {!date.surprise && <p className={styles.rowDesc}>{date.description}</p>}
      </div>
      <span className={styles.rowArrow}>→</span>
    </motion.button>
  )
}