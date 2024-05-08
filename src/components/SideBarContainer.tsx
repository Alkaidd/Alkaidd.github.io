import { useConfigStore } from '@/hooks/store'
import { css } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'

// todo: forbid collapse while mobile
export default function SideBarContianer(props: { content: React.ComponentType }) {
  const [containerCss, setCss] = useState(css({}))
  const collapse = useRef(true)
  const Content = props.content

  const mobileFlag = useConfigStore((state) => state.mobileFlag)

  function setCollapse(flag: boolean) {
    if (!mobileFlag) {
      setCss(css({}))
      return
    }
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
    setCollapse(true)
  }, [mobileFlag])
  return (
    <div h-full pos-relative style={{ width: mobileFlag ? '0' : 'fit-content' }}>
      {collapse.current ? null : (
        <div w-screen h-full pos-absolute left-0 z-5 style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
      )}
      <div
        h-full
        transition-transform
        duration-500
        z-10
        css={containerCss}
        style={{ width: mobileFlag ? '100vh' : 'fit-content' }}
        onClick={() => setCollapse(true)}>
        {mobileFlag ? (
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
        ) : null}
        <div
          w-fit
          h-full
          left-0
          onClick={() => {
            setCollapse(false)
          }}
          style={{ position: mobileFlag ? 'absolute' : 'unset' }}>
          <Content />
        </div>
      </div>
    </div>
  )
}
