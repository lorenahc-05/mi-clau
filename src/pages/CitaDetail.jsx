import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './CitaDetail.module.css'

// Barcode decorativo
function Barcode() {
  const bars = Array.from({ length: 32 }, (_, i) => ({
    w: [2,3,1,4,2,1,3,2,1,2,4,1,2,3,1,2,3,1,4,2,1,3,2,1,4,1,2,3,2,1,4,2][i] || 2,
    h: 60 + Math.sin(i * 0.8) * 20,
  }))
  return (
    <div className={styles.ticketBarcode}>
      {bars.map((b, i) => (
        <div key={i} className={styles.ticketBar} style={{ width: b.w, height: `${b.h}%` }} />
      ))}
    </div>
  )
}

export default function CitaDetail({ cita, onVote, savedVote }) {
  const navigate = useNavigate()
  const [voted, setVoted] = useState(savedVote || null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingVote, setPendingVote] = useState(null)

  function handleOption(opt) { setPendingVote(opt); setShowConfirm(true) }
  function confirmVote() {
    setVoted(pendingVote)
    onVote?.(cita.id, pendingVote)
    setShowConfirm(false)
  }

  if (!cita) return null

  return (
    <div className={styles.page}>
      <div className={styles.overlay} />

      <motion.div className={styles.inner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Nav */}
        <div className={styles.topNav}>
          <button className={styles.back} onClick={() => navigate('/citas')}>← citas</button>
          <span className={styles.topLabel}>entrada</span>
        </div>

        {/* Ticket */}
        <div className={`${styles.ticket} ${cita.surprise ? styles.ticketSurprise : ''}`}>

          {/* Top */}
          <div className={styles.ticketTop}>
            <div className={styles.ticketType}>
              {cita.surprise ? '✦ sorpresa' : cita.poll ? 'votación' : 'cita'}
            </div>
            <h1 className={styles.ticketTitle}>{cita.title}</h1>
            <div className={styles.ticketMeta}>
              {cita.isoDate && (
                <div className={styles.ticketMetaRow}>
                  <span className={styles.ticketMetaIcon}>📅</span>
                  <span>{cita.isoDate}{cita.time ? ` · ${cita.time}` : ''}</span>
                </div>
              )}
              {cita.place && (
                <div className={styles.ticketMetaRow}>
                  <span className={styles.ticketMetaIcon}>📍</span>
                  <span>{cita.place}</span>
                </div>
              )}
              {cita.organizer && (
                <div className={styles.ticketMetaRow}>
                  <span className={styles.ticketMetaIcon}>✦</span>
                  <span>organiza {cita.organizer}</span>
                </div>
              )}
            </div>
          </div>

          {/* Perforado */}
          <div className={styles.ticketPerf}>
            <div className={styles.ticketPerfLine} />
          </div>

          {/* Bottom */}
          <div className={styles.ticketBottom}>
            {cita.surprise ? (
              <p className={styles.surpriseMsg}>🎁 Esta cita es una sorpresa</p>
            ) : (
              cita.description && <p className={styles.ticketDesc}>{cita.description}</p>
            )}

            {(cita.money || cita.organizer) && (
              <div className={styles.ticketDetails}>
                {cita.money && (
                  <div className={styles.ticketDetail}>
                    <span className={styles.ticketDetailLabel}>coste</span>
                    <span className={styles.ticketDetailValue}>{cita.money}</span>
                  </div>
                )}
                {cita.split !== undefined && cita.money && (
                  <div className={styles.ticketDetail}>
                    <span className={styles.ticketDetailLabel}>pago</span>
                    <span className={styles.ticketDetailValue}>{cita.split ? 'a medias' : 'invita'}</span>
                  </div>
                )}
              </div>
            )}

            <Barcode />
          </div>
        </div>

        {/* Foto */}
        {cita.photo && (
          <div className={styles.photoWrap}>
            <img src={cita.photo} alt={cita.title} className={styles.photo} />
          </div>
        )}

        {/* Poll */}
        {cita.poll?.options?.length > 0 && (
          <div className={styles.pollWrap}>
            <h2 className={styles.pollTitle}>{cita.poll.question || '¿Qué prefieres?'}</h2>
            <div className={styles.pollOptions}>
              {cita.poll.options.map((opt, i) => (
                <motion.button
                  key={i}
                  className={`${styles.pollOption} ${voted === opt ? styles.pollOptionVoted : ''}`}
                  onClick={() => !voted && handleOption(opt)}
                  whileTap={{ scale: 0.97 }}
                  whileHover={!voted ? { scale: 1.02 } : {}}
                >
                  <span className={styles.pollLetter}>{String.fromCharCode(65+i)})</span>
                  <span>{opt}</span>
                  {voted === opt && <span className={styles.pollCheck}>✓</span>}
                </motion.button>
              ))}
            </div>
            {voted && (
              <motion.p className={styles.pollVotedMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Has votado: <strong>{voted}</strong> · <button className={styles.pollChange} onClick={() => setVoted(null)}>cambiar</button>
              </motion.p>
            )}
          </div>
        )}

      </motion.div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div className={styles.confirmOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)}>
            <motion.div className={styles.confirmBox} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <p className={styles.confirmQ}>¿Segura que eliges</p>
              <p className={styles.confirmOpt}>"{pendingVote}"?</p>
              <div className={styles.confirmBtns}>
                <button className={styles.confirmNo} onClick={() => setShowConfirm(false)}>No</button>
                <button className={styles.confirmYes} onClick={confirmVote}>¡Sí!</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}