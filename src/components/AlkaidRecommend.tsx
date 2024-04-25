import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Masonry from '@mui/lab/Masonry'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fileInfoList } from './article'

// const heights = [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80].map((item) => item * 2)

type RecommendItem = {
  name: string
  img: string | null
  abstract: string
  path?: string
}

type ComputedItem = {
  height: number
  imgHeight: number
  abstractHeight: number
} & RecommendItem

const recommendItems: RecommendItem[] = [
  {
    name: '俄罗斯方块',
    img: '/static/tetris.png',
    abstract: '经典游戏，俄罗斯方块。',
    path: '/moyu/tetris',
  },
  {
    name: '贪吃蛇',
    img: '',
    abstract: '经典游戏，贪吃蛇。开发中...',
  },
]

fileInfoList.forEach((fileInfo) => {
  recommendItems.push({
    name: fileInfo.title,
    img: null,
    abstract: fileInfo.abstract,
    path: '/article/' + fileInfo.name,
  })
})

function getItemDefaultHeight(item: RecommendItem, width: number, fontSize: number): ComputedItem {
  const baseHeight = 120
  let imgHeight = 0
  let abstractHeight = 0
  if (item.img != null) {
    imgHeight = (width / 3) * 4
  }
  const lineCount = width / (fontSize + 1)
  const lines = item.abstract.length / lineCount

  if (lines > 3) {
    abstractHeight = lines * (fontSize + 5)
  }

  return {
    ...item,
    height: baseHeight + imgHeight + abstractHeight,
    imgHeight,
    abstractHeight,
  }
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'all 1s ease',
  cursor: 'pointer',
  '&:hover': {
    zIndex: 999,
    transform: 'scale(1.1)',
  },
}))

function BasicMasonry(props: { width: number }) {
  const navigate = useNavigate()

  function handleClickItem(item: ComputedItem) {
    if (item.path) {
      navigate(item.path)
    } else {
      alert('还在开发中啦')
    }
  }

  return (
    <Box sx={{ width: props.width, minHeight: 600 }}>
      <Masonry columns={4} spacing={2}>
        {recommendItems.map((item, index) => {
          const newItem = getItemDefaultHeight(item, props.width / 4 - 16, 17)
          // console.log(index, newItem.height)
          return (
            <Item onClick={() => handleClickItem(newItem)} key={index} sx={{ height: newItem.height }}>
              {newItem.img != null ? (
                <div w-full style={{ height: `${newItem.imgHeight}px` }}>
                  <img w-full h-full object-contain object-cc src={newItem.img} />
                </div>
              ) : null}
              <div w-full style={{ borderTop: '1px solid var(--bottom-line-color)' }}>
                <div flex justify-center>
                  <div text-lg whitespace-nowrap overflow-hidden className='w-3/4' text-ellipsis>
                    {item.name}
                  </div>
                </div>
                <div>{item.abstract}</div>
              </div>
            </Item>
          )
        })}
      </Masonry>
    </Box>
  )
}

export function AlkaidRecommend() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(1100)
  useEffect(() => {
    const handleResize = (newWidth: number) => {
      if (containerRef.current) {
        setWidth(newWidth)
      }
    }
    const resizeObserver = new ResizeObserver(([entry]) => {
      handleResize(entry.contentRect.width)
    })

    let container: HTMLDivElement | null = null
    if (containerRef.current) {
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
