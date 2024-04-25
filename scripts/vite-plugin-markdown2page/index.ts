import { Plugin } from 'vite'
import { Config } from './type'
import * as fs from 'fs'
import * as path from 'path'
// import * as prod from 'react/jsx-runtime'
import remarkParse from 'remark-parse'
// import rehypeReact from 'rehype-react'
import { unified } from 'unified'
// import { toHast } from 'mdast-util-to-hast'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import { type VFile } from 'vfile'
import { type Root } from 'mdast'

const fileRegex = /\.(md)$/
let files = []

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
      files = []
      if (config && config.target) {
        targetPath = path.join('src/assets/', config.target[0])
      } else {
        return
      }

      console.log('buildStart: markdown2page')
      if (myConfig.mode === 'build' || config.force) {
        console.log('start building target dir md files...')
        await buildMarkdown2Jsx(targetPath)
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

// const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs }
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, {})
  .use(rehypeRaw)
  .use(myRehypeFormat as typeof remarkRehype)
  .use(rehypeStringify, { closeEmptyElements: true, closeSelfClosing: true })

function myRehypeFormat() {
  return function (tree: Root, file: VFile) {
    const oldRoot = tree.children

    const newRoot = [
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: oldRoot,
      },
    ] as unknown as typeof oldRoot
    tree.children = newRoot

    return tree
  }
}

async function markdown2jsx(markdown: string, functionName: string): Promise<string> {
  const file = await processor.process(markdown)
  const res = String(file.value)

  const jsx = 'export default function ' + functionName + ' () {\n' + 'return ' + res + '}'
  return jsx
}

async function buildMarkdown2Jsx(targetPath: string) {
  try {
    const files = await fs.promises.readdir(targetPath)
    const tempPath = 'src/components/article'

    const fileIndex: string[] = []
    for (const file of files) {
      if (fileRegex.test(file)) {
        const filePath = path.join(targetPath, file)
        const data = await fs.promises.readFile(filePath, 'utf8')
        const jsx = await markdown2jsx(data, file.split('.')[0])
        // console.log(jsx)

        const newName = file.replace(fileRegex, '.tsx')
        await writeFileForce(tempPath, path.join(tempPath, newName), jsx)

        fileIndex.push(newName)
      }
    }

    await writeFile(path.join(tempPath, 'index.ts'), getIndexTs(fileIndex))
  } catch (e) {
    console.log(e)
  }
}

async function writeFileForce(directory: string, fullPath: string, content: string) {
  await fs.mkdir(directory, { recursive: true }, async (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        // 目录已经存在
        await clearDirectory(directory)
        await writeFile(fullPath, content)
      } else {
        // 出现其他错误
        console.error('创建目录时出错:', err)
      }
    } else {
      // 目录已成功创建，继续写入文件
      await writeFile(fullPath, content)
    }
  })
}

async function writeFile(filePath: string, content: string) {
  await fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('write file error:', err)
    }
  })
}

async function clearDirectory(dirPath: string) {
  // 读取目录内容
  await fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('read dir error:', err)
      return
    }

    // 如果目录为空，则不需要执行任何操作
    if (files.length === 0) {
      return
    }

    // 遍历目录中的每个文件和子目录
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file)
      // 获取文件或目录的信息
      fs.stat(fullPath, (err, stat) => {
        if (err) {
          console.error('get file info error:', err)
          return
        }
        // 判断是文件还是目录
        if (stat.isFile()) {
          // 删除文件
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error('del file error:', err)
            }
          })
        } else if (stat.isDirectory()) {
          // 递归删除子目录
          clearDirectory(fullPath)
        }
      })
    })
  })
}

function getIndexTs(files: string[]) {
  let content = ''
  files.forEach((filename) => {
    content = content + `export { default as ` + filename.split('.')[0] + ` } from './` + filename + `'\n`
  })

  return content
}
