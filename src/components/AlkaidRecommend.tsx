import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Masonry from '@mui/lab/Masonry'
import { useEffect, useRef, useState } from 'react'

const heights = [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80].map((item) => item * 2)

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'all 1s ease',
  '&:hover': {
    zIndex: 999,
    transform: 'scale(1.1)',
  },
}))

function BasicMasonry(props: { width: number }) {
  return (
    <Box sx={{ width: props.width, minHeight: 600 }}>
      <Masonry columns={4} spacing={2}>
        {heights.map((height, index) => (
          <Item key={index} sx={{ height }}>
            {index + 1}
          </Item>
        ))}
      </Masonry>
    </Box>
  )
}

export function AlkaidRecommend() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(1100)
  useEffect(() => {
    const handleResize = (newWidth: number) => {
      console.log('onresize')
      if (containerRef.current) {
        // const newWidth = containerRef.current.offsetWidth
        console.log('getWidth', newWidth)
        setWidth(newWidth)
      }
    }
    const resizeObserver = new ResizeObserver(([entry]) => {
      handleResize(entry.contentRect.width)
      // console.log('组件宽度变化:', entry.contentRect.width);
    })

    let container: HTMLDivElement | null = null
    if (containerRef.current) {
      console.log('on observer')
      resizeObserver.observe(containerRef.current)
      container = containerRef.current
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container)
      }
    }
  }, [])
  return (
    <div ref={containerRef} w-full pt-20 box-border h-full overflow-y-auto>
      <BasicMasonry width={width} />
    </div>
  )
}
