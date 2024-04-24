import { Plugin } from 'vite'
import { Config } from './type'
import * as fs from 'fs'
import * as path from 'path'

const fileRegex = /\.(md)$/

export default function vitePluginMarkdown2Page(config?: Config): Plugin {
  const myConfig: {
    mode: 'serve' | 'build'
  } = {
    mode: 'serve',
  }

  return {
    name: 'markdown2page',
    apply(config, { command }) {
      myConfig.mode = command
      return true
    },
    async buildStart() {
      let targetPath = ''
      if (config && config.target) {
        targetPath = path.join('src/assets/', config.target[0])
      } else {
        return
      }

      await buildMarkdown2Jsx(targetPath)

      console.log('buildStart: markdown2page')
      if (myConfig.mode === 'serve') {
        console.log('start building target dir md files...')

        console.log('build target md files success!')
      }
    },
    transform(src, id) {
      if (fileRegex.test(id)) {
        console.log(id)
        return {
          code: '',
          map: null,
        }
      }
    },
  }
}

function markdown2jsx(markdown: string): string {
  // const html = 'test'

  return markdown
}

async function buildMarkdown2Jsx(targetPath: string) {
  try {
    const files = await fs.promises.readdir(targetPath)

    for (const file of files) {
      if (fileRegex.test(file)) {
        const filePath = path.join(targetPath, file)
        const data = await fs.promises.readFile(filePath, 'utf8')
        const html = markdown2jsx(data)
        console.log(html)
      }
    }
  } catch (e) {
    console.log(e)
  }
}
