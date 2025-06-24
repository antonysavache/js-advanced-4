import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: [],
  build: {
    rollupOptions: {
      external: []
    }
  }
})
