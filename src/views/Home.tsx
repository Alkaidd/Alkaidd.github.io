import { AlkaidRecommend } from '@/components/AlkaidRecommend'
import { SideMenu } from '@/components/SideMenu'
import SlowShowText from '@/components/SlowShowText'
// import TetrisScreen from '@/components/Tetris'
import { css } from '@emotion/react'

const navStyle = css`
  width: var(--nav-width);
`

const menuStyle = css({
  borderRight: '1px solid var(--bottom-line-color)',
})

const headerBarStyle = css({
  borderBottom: '1px solid var(--bottom-line-color)',
  height: '64px',
  fontSize: '21px',
  fontWeight: 700,
  padding: '6px',
})

const headerStyle = css({
  width: 'calc(100% - var(--nav-width))',
})

export default function Home() {
  return (
    <div flex w-full h-full>
      <nav css={navStyle} flex flex-col>
        <div css={headerBarStyle}>
          <SlowShowText text={'你好，这里是Alkaid的小站。'} />
        </div>
        <div flex-1 w-full css={menuStyle} z-1002>
          <SideMenu />
        </div>
      </nav>
      <header
        css={css`
          ${headerStyle};
          ${headerBarStyle}
        `}
        backdrop-blur-8
        pos-fixed
        z-1001
        left-auto
        top-0
        right-0>
        <div></div>
      </header>
      <main flex-1 min-w-0 h-full>
        <AlkaidRecommend />
      </main>
    </div>
  )
}
