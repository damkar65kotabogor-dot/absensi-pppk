import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/absensi-pppk',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
