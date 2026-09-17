import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || 'http://localhost:8000/api/v1'),
    },
    optimizeDeps: {
      include: ['@dnd-kit/core', '@dnd-kit/utilities', '@dnd-kit/modifiers'],
    },
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/node_modules/**', '**/.git/**'],
      },
    },
  }
})
