import { isMobile } from '@/utils/tools'
import { css } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'

export default function SideBarContianer(props: { content: React.ComponentType }) {
  const [containerCss, setCss] = useState(css({}))
  const collapse = useRef(true)
  const Content = props.content

  function setCollapse(flag: boolean) {
    if (!flag) {
      setCss(
        css({
          position: 'absolute',
          right: 0,
          transform: 'translateX(100%)',
        }),
      )
    } else {
      setCss(
        css({
          position: 'absolute',
          right: 0,
        }),
      )
    }
    collapse.current = flag
  }
  useEffect(() => {
    if (isMobile()) {
      setCollapse(true)
    }
  }, [])
  return (
    <div w-0 h-full pos-relative>
      {collapse.current ? null : (
        <div w-screen h-full pos-absolute left-0 z-5 style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
      )}
      <div w-screen h-full transition-transform duration-500 z-10 css={containerCss} onClick={() => setCollapse(true)}>
        <div
          h-10
          w-10
          pos-absolute
          z-10
          right--12
          rounded-10
          flex
          justify-center
          items-center
          font-800
          color-lightblue
          onClick={(e) => {
            setCollapse(false)
            e.stopPropagation()
          }}
          style={{
            transform: 'translateY(35vh)',
            backgroundColor: 'var(--hover-bg-color)',
            borderColor: 'var(--paper-border-color)',
          }}>
          {'>>'}
        </div>
        <div w-fit h-full pos-absolute left-0 onClick={(e) => e.stopPropagation()}>
          <Content />
        </div>
      </div>
    </div>
  )
}
