import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, process.cwd(), '')
  const target = VITE_API_URL?.replace(/\/+$/, '')

  return {
    plugins: [react()],
    server: target ? {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
        },
      },
    } : undefined,
  }
})
