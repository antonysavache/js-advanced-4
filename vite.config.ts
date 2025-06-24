import { defineConfig } from 'vite'
import injectHTML from 'vite-plugin-html-inject'

export default defineConfig({
  plugins: [
    injectHTML()
  ],
  assetsInclude: [],
  build: {
    rollupOptions: {
      external: []
    }
  }
})