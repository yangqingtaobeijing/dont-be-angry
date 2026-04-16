import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/dont-be-angry/',
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
})
