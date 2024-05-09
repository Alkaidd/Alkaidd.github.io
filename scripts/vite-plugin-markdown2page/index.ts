import { Plugin } from 'vite'
import { Config } from './type'
import * as fs from 'fs'
import * as path from 'path'
// import * as prod from 'react/jsx-runtime'
import remarkParse from 'remark-parse'
// import rehypeReact from 'rehype-react'
import { unified } from 'unified'
// import { toHast } from 'mdast-util-to-hast'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import { type VFile } from 'vfile'
import { RootContent, type Root } from 'mdast'
import { exec } from 'child_process'

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
  .use(remarkGfm)
  .use(remarkRehype, {})
  .use(rehypeHighlight)
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

    dfsFormatNode(newRoot)
    tree.children = newRoot

    return tree
  }
}

type MyRootContent = RootContent & { tagName: string; children: any[] }
function dfsFormatNode(nodes: RootContent[]) {
  ;(nodes as MyRootContent[]).forEach((node) => {
    if (node.tagName === 'code') {
      formatCodeTag(node)
    } else if (node.tagName === 'pre') {
      formatPreTag(node)
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      dfsFormatNode(node.children)
    }
  })
}

function formatCodeTag(node: MyRootContent) {
  node.children.forEach((content) => {
    if (content.type === 'text') {
      content.value = '{`' + content.value + '`}'
    } else if (Array.isArray(content.children) && content.children.length > 0) {
      formatCodeTag(content)
    }
  })
}

function formatPreTag(node: MyRootContent) {
  if (node.children && node.children.some((item) => item.tagName === 'code')) {
    node.children.push({
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'code-buttons',
      },
      children: [
        {
          type: 'element',
          tagName: 'button',
          properties: {
            className: 'copy-button',
            title: 'copy',
          },
          children: [
            {
              type: 'text',
              tagName: '',
              value: 'copy',
              children: [],
            },
          ],
        },
      ],
    })
  }
}

async function markdown2jsx(markdown: string, functionName: string): Promise<string> {
  const file = await processor.process(markdown)
  const res = changeHtmlProperty2Jsx(String(file.value))

  const jsx = 'export default function ' + functionName + ' () {\n' + 'return ' + res + '}'
  return jsx
}

async function buildMarkdown2Jsx(targetPath: string) {
  try {
    const files = await fs.promises.readdir(targetPath)
    const tempPath = 'src/components/article'

    const fileIndex: IndexTsFileInfo[] = []
    for (const file of files) {
      if (fileRegex.test(file)) {
        const filePath = path.join(targetPath, file)
        const data = await fs.promises.readFile(filePath, 'utf8')
        const jsx = await markdown2jsx(data, file.split('.')[0])
        const stats = await fs.promises.stat(filePath)

        const birthTime = await getGitFirstCommitTime(filePath)

        const newName = file.replace(fileRegex, '.tsx')
        await writeFileForce(tempPath, path.join(tempPath, newName), jsx)

        fileIndex.push({
          fullname: newName,
          title: findH1Title(jsx),
          abstract: findPAbstract(jsx),
          birthTime,
          fileSize: stats.size,
        })
      }
    }

    await writeFile(path.join(tempPath, 'index.ts'), getIndexTs(fileIndex))
  } catch (e) {
    console.log(e)
  }
}

async function getGitFirstCommitTime(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      `git log --reverse --pretty=format:"%ad" --date=short --follow -- ${filePath} | head -n 1`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }
        resolve(stdout.trim())
      },
    )
  })
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

type IndexTsFileInfo = {
  fullname: string
  title: string
  abstract: string
  birthTime: string
  fileSize: number
}
function getIndexTs(files: IndexTsFileInfo[]) {
  let content = ''
  const filenames: string[] = []
  // set import tsx
  files.forEach((fileInfo, index) => {
    filenames.push(fileInfo.fullname.split('.')[0])
    content = content + `import { default as ` + filenames[index] + ` } from './` + fileInfo.fullname + `'\n`
  })

  // set export fileInfo
  content += '\n'
  content += 'export const fileInfoList = [ \n'
  content += files
    .map((file, index) => {
      return formatShallowObj({
        name: filenames[index],
        title: file.title,
        abstract: file.abstract,
        birthTime: file.birthTime,
        fileSize: file.fileSize,
      })
    })
    .join(',\n')
  content += '\n]\n'

  // set export all tsx
  content += '\n'
  content += 'export default { ' + filenames.join(', ') + ' }\n'

  return content
}

function findH1Title(htmlContent: string) {
  // 使用正则表达式匹配第一个 <h1> 标签的内容
  const regex = /<h1>(.*?)<\/h1>/
  const match = regex.exec(htmlContent)
  if (match) {
    return match[1]
  }
  return ''
}

function findPAbstract(htmlContent: string) {
  // 使用正则表达式匹配第一个 <p> 标签的内容
  const regex = /<p>(.*?)<\/p>/
  const match = regex.exec(htmlContent)
  if (match) {
    return match[1]
  }
  return ''
}

function changeHtmlProperty2Jsx(htmlContent: string) {
  return htmlContent.replace(/(<[^>]*\s)class=(["'])([^"'>]*)\2/gi, function (match, p1, p2, p3) {
    return p1 + 'className=' + p2 + p3 + p2
  })
}

function formatShallowObj(target: Record<string, string | number>): string {
  let outputString = '{\n'
  Object.keys(target).forEach((key, index, arr) => {
    let keyVal: string | number = ''
    if (typeof target[key] === 'string') {
      keyVal = `'${target[key]}'`
    } else if (typeof target[key] === 'number') {
      keyVal = target[key]
    }
    outputString += `  ${key}: ${keyVal}`
    if (index !== arr.length - 1) {
      outputString += ',\n'
    } else {
      outputString += '\n'
    }
  })
  outputString += '}'

  return outputString
}
