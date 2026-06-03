import { useParams, useNavigate } from 'react-router-dom'
import CitaDetail from './CitaDetail'

export default function CitaCustomPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const citas = (() => {
    try { return JSON.parse(localStorage.getItem('miclau-citas') || '[]') } catch { return [] }
  })()

  const cita = citas.find(c => c.id === id)
  if (!cita) return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Cita no encontrada. <button onClick={() => navigate('/citas')}>Volver</button></div>

  function handleVote(citaId, option) {
    const votes = JSON.parse(localStorage.getItem('miclau-votes') || '{}')
    votes[citaId] = option
    localStorage.setItem('miclau-votes', JSON.stringify(votes))
  }

  const votes = (() => {
    try { return JSON.parse(localStorage.getItem('miclau-votes') || '{}') } catch { return {} }
  })()

  return <CitaDetail cita={cita} onVote={handleVote} savedVote={votes[id]} />
}