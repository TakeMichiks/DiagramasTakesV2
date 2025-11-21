import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/load-diagram': 'http://localhost:5000',
      '/save-diagram': 'http://localhost:5000',
      '/upload': 'http://localhost:5000'
    }
  }
})
