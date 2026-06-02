import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// Plugin para copiar el worker de pdfjs a /public antes del build
function copyPdfjsWorker() {
  return {
    name: 'copy-pdfjs-worker',
    buildStart() {
      const src = resolve('node_modules/pdfjs-dist/build/pdf.worker.min.mjs')
      const dest = resolve('public/pdf.worker.min.mjs')
      try {
        copyFileSync(src, dest)
      } catch(e) {
        console.warn('No se pudo copiar el worker de pdfjs:', e.message)
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), copyPdfjsWorker()],
})