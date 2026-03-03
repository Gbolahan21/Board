import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(() => {
  return {
    server: {
      hmr: true,
      open: true,
    },
    plugins: [react()],
  }
})