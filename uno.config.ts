// 以下代码需全部 cv 过去!!! 如果没有的话可能会引起 unocss 插件不起作用,导致没有提示
// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno } from 'unocss'
import transformerAttributifyJsx from 'transformer-attributify-jsx-sg'

export default defineConfig({
  theme: {},
  shortcuts: {
    // 这里可以放全局公共样式
    'h-btn': 'h-48px w-100% bg-#5C33BE b-none text-white rounded-8px',
  },
  safelist: [],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: { display: 'inline-block', 'vertical-align': 'middle' },
    }),
    presetTypography(),
  ],
  rules: [
    [
      'list-none',
      {
        'list-style': 'none',
        margin: 0,
        padding: 0,
      },
    ],
  ],
  transformers: [transformerAttributifyJsx()],
})
