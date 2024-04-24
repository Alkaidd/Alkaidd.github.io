import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import React from '@vitejs/plugin-react'
import { resolve } from 'path'
import Markdown2Page from './scripts/vite-plugin-markdown2page'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    Markdown2Page({
      target: ['articles'],
    }),
    React(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
