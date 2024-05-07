import { useEffect, useRef } from 'react'

export default function ScreenContainer({ content: Content }: { content: React.ComponentType }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const scaleContent = useRef<HTMLDivElement>(null)
  const scaleRatio = useRef(1)

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current && scaleContent.current) {
        const widthRatio = scaleContent.current.offsetWidth / contentRef.current.offsetWidth
        const heightRatio = scaleContent.current.offsetHeight / contentRef.current.offsetHeight
        scaleRatio.current = 1 / Math.max(heightRatio, widthRatio)
      }
    }
    const resizeObserver = new ResizeObserver(([]) => {
      console.log('resize')
      handleResize()
    })

    let container: HTMLDivElement | null = null
    let content: HTMLDivElement | null = null
    if (contentRef.current && scaleContent.current) {
      resizeObserver.observe(contentRef.current)
      resizeObserver.observe(scaleContent.current)
      container = contentRef.current
      content = scaleContent.current
    }

    return () => {
      if (container && content) {
        resizeObserver.unobserve(container)
        resizeObserver.unobserve(content)
      }
    }
  }, [])

  return (
    <div w-full flex flex-1 h-full justify-center min-h-0 overflow-hidden ref={contentRef}>
      <div w-fit h-fit ref={scaleContent} transform-origin-tc style={{ transform: `scale(${scaleRatio.current})` }}>
        <Content />
      </div>
    </div>
  )
}
