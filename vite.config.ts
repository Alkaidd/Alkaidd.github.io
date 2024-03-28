import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import React from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), React()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
