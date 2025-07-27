import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: [
      'fb568c5d-1ffb-4d80-a066-37b99015d06d-00-3ttasnl8s73ny.picard.replit.dev',
      /\.replit\.dev$/
    ],
  },
})
