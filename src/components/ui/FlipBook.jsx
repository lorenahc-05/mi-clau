import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'
import styles from './FlipBook.module.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const SCALE = 1.6

export default function FlipBook({ pdfUrl, onClose }) {
  const [pages, setPages] = useState([])
  const [total, setTotal] = useState(0)
  // current=0 → portada sola (pages[0])
  // current=1 → pages[1] izq + pages[2] der
  // current=3 → pages[3] izq + pages[4] der
  const [current, setCurrent] = useState(0)
  const [flipping, setFlipping] = useState(null)
  const [flipImg, setFlipImg] = useState(null)

  const renderPage = useCallback(async (pdf, pageNum) => {
    const page = await pdf.getPage(pageNum)
    const vp = page.getViewport({ scale: SCALE })
    const canvas = document.createElement('canvas')
    canvas.width = vp.width
    canvas.height = vp.height
    await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise
    return canvas.toDataURL('image/jpeg', 0.82)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const pdf = await pdfjsLib.getDocument({ url: window.location.origin + pdfUrl }).promise
      if (cancelled) return
      setTotal(pdf.numPages)
      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelled) return
        const dataUrl = await renderPage(pdf, i)
        if (!cancelled) setPages(prev => [...prev, dataUrl])
      }
    }
    load()
    return () => { cancelled = true }
  }, [pdfUrl, renderPage])

  // Imágenes visibles según posición
  // current=0 → portada sola (página 1)
// current=1 → página 2 (izq) + página 3 (der)
// current=3 → página 4 (izq) + página 5 (der)
const leftImg  = current === 0 ? null : (pages[current] ?? null)
const rightImg = current === 0 ? pages[0] : (pages[current + 1] ?? null)

const canNext = current === 0 ? pages.length > 1 : current + 2 < total
const canPrev = current > 0

  function goNext() {
  if (!canNext || flipping) return
  setFlipImg(current === 0 ? pages[0] : rightImg)
  setFlipping('next')
  setTimeout(() => {
    setCurrent(c => c === 0 ? 1 : c + 2)
    setFlipping(null)
    setFlipImg(null)
  }, 550)
}

function goPrev() {
  if (!canPrev || flipping) return
  setFlipImg(leftImg ?? rightImg)
  setFlipping('prev')
  setTimeout(() => {
    setCurrent(c => c <= 1 ? 0 : c - 2)
    setFlipping(null)
    setFlipImg(null)
  }, 550)
}

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.wrapper} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {pages.length === 0 ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Preparando tu revista…</p>
          </div>
        ) : (
          <>
            <div className={`${styles.book} ${current === 0 ? styles.bookCover : ''}`}>
              <div className={styles.spine} />

              <div className={styles.pageLeft}>
                {leftImg
                  ? <img src={leftImg} alt="" draggable={false} />
                  : <div className={styles.pageBlank} />}
              </div>

              <div className={styles.pageRight}>
                {rightImg
                  ? <img src={rightImg} alt="" draggable={false} />
                  : <div className={styles.pageBlank} />}
              </div>

              <AnimatePresence>
                {flipping === 'next' && flipImg && (
                  <motion.div
                    key="flip-next"
                    className={`${styles.flipPage} ${styles.flipRight}`}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -180 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
                  >
                    <img src={flipImg} alt="" draggable={false} />
                  </motion.div>
                )}
                {flipping === 'prev' && flipImg && (
                  <motion.div
                    key="flip-prev"
                    className={`${styles.flipPage} ${styles.flipLeft}`}
                    initial={{ rotateY: -180 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
                  >
                    <img src={flipImg} alt="" draggable={false} />
                  </motion.div>
                )}
              </AnimatePresence>

              {canPrev && <button className={styles.hitLeft}  onClick={goPrev} aria-label="Anterior" />}
              {canNext && <button className={styles.hitRight} onClick={goNext} aria-label="Siguiente" />}
            </div>

            {pages.length < total && (
              <p className={styles.loadingMore}>Cargando… {pages.length}/{total}</p>
            )}

            <div className={styles.controls}>
              <button className={styles.navBtn} onClick={goPrev} disabled={!canPrev}>‹</button>
              <span className={styles.pageNum}>
                {current === 0
                  ? `Portada · ${total} pág.`
                  : `${current}–${Math.min(current + 1, total)} / ${total}`}
              </span>
              <button className={styles.navBtn} onClick={goNext} disabled={!canNext}>›</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}