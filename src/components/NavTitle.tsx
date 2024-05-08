import { css } from '@emotion/react'
import SlowShowText from './SlowShowText'
import { useNavigate } from 'react-router-dom'

const BRStyle = css({
  borderRight: '1px solid var(--bottom-line-color)',
})

const headerBarStyle = css({
  borderBottom: '1px solid var(--bottom-line-color)',
  height: '5rem',
  fontSize: '21px',
  fontWeight: 700,
  padding: '6px',
})

export default function NavTitle(props: { title: string }) {
  const navigate = useNavigate()

  return (
    <div flex w-full backdrop-blur-8 pos-fixed z-1001 top-0 box-border css={headerBarStyle}>
      <div css={BRStyle} flex justify-center items-center p-2 cursor-pointer onClick={() => navigate('/home')}>
        home
      </div>
      <div pl-2>
        <SlowShowText text={props.title} />
      </div>
    </div>
  )
}
