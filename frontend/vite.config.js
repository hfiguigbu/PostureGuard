import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const { VITE_API_URL, VITE_NODE_RED_URL } = loadEnv(mode, process.cwd(), '')
  const flaskTarget = VITE_API_URL?.replace(/\/+$/, '')
  const nodeRedTarget = VITE_NODE_RED_URL?.replace(/\/+$/, '') || 'http://25.37.73.105:1880'
  const proxy = {
    '/node-red': {
      target: nodeRedTarget,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/node-red/, ''),
    },
  }

  if (flaskTarget) {
    proxy['/api'] = {
      target: flaskTarget,
      changeOrigin: true,
    }
  }

  return {
    plugins: [react()],
    server: { proxy },
  }
})
