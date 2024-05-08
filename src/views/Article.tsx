import NavTitle from '@/components/NavTitle'
import SideBarContianer from '@/components/SideBarContainer'
import articles from '@/components/article'
import { fileInfoList } from '@/components/article'
import { css } from '@emotion/react'
import { Route, Routes, useNavigate } from 'react-router-dom'

const ArticleComponentNames = Object.keys(articles)
const fileMap: Record<string, (typeof fileInfoList)[0]> = {}
fileInfoList.forEach((item) => {
  fileMap[item.name] = item
})

const sideWidth = css`
  width: var(--side-item-width);
`

const brStyle = css({
  borderRight: '1px solid var(--bottom-line-color)',
})

const sideItemStyle = css({
  cursor: 'pointer',
  '&:hover': {
    background: 'var(--hover-bg-color)',
  },
})

export default function Article() {
  const navigate = useNavigate()

  function toArticle(name: string) {
    navigate(`${name}`)
  }

  async function clickArticleItem(event: { target: HTMLButtonElement }) {
    if (event == null) {
      return
    }
    if (event.target && event.target.className === 'copy-button') {
      if (event.target.parentNode && event.target.parentNode.parentNode) {
        const pre = event.target.parentNode.parentNode as HTMLPreElement
        const code = pre.querySelector('code')
        if (code) {
          await navigator.clipboard.writeText(code.innerText)
        }
      }
    }
  }
  return (
    <div h-full w-full>
      <NavTitle title='这里是Alkaid的文章记录。' />
      <div h-full w-full flex pt-20>
        <SideBarContianer
          content={function () {
            return (
              <div
                h-full
                bg-white
                css={css`
            ${sideWidth}${brStyle}}
          `}>
                {fileInfoList.map((fileInfo, index) => {
                  return (
                    <div css={sideItemStyle} key={index} w-full p-1 onClick={() => toArticle(fileInfo.name)}>
                      {fileInfo.title}
                    </div>
                  )
                })}
              </div>
            )
          }}
        />
        <div h-full flex-1 overflow-auto mt--20 pt-20 box-border className='article'>
          <Routes>
            {ArticleComponentNames.map((ArticleComName, index) => {
              // console.log('path', ArticleComName)
              const ArticleCom = Reflect.get(articles, ArticleComName)
              return (
                <Route
                  path={ArticleComName}
                  key={index}
                  element={
                    <div onClick={(e) => clickArticleItem(e as unknown as { target: HTMLButtonElement })} p-2>
                      <div color-coolgray text-sm>
                        <span pr-12>
                          CreateTime:{' '}
                          <time dateTime={fileMap[ArticleComName].birthTime}>{fileMap[ArticleComName].birthTime} </time>
                        </span>
                        <span>Size: {fileMap[ArticleComName].fileSize}</span>
                      </div>
                      <ArticleCom key={index} />
                    </div>
                  }
                />
              )
            })}
            <Route path='*' key='*' element={<div>default</div>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
