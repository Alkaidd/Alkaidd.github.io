import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Masonry from '@mui/lab/Masonry'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fileInfoList } from './article'
import { useConfigStore } from '@/hooks/store'

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
    img: '/static/snake.png',
    abstract: '经典游戏，贪吃蛇。',
    path: '/moyu/snake',
  },
  {
    name: '测试游戏demo',
    img: '/static/star-dream.png',
    abstract: '使用canvas + pixi.js + matter.js开发，开发中...',
    path: '/moyu/star-dream',
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

function getItemDefaultHeight(item: RecommendItem, width: number): ComputedItem {
  let imgHeight = 0
  let abstractHeight = 30
  if (item.img != null) {
    imgHeight = (width / 3) * 4
  }

  const abstractDiv = document.getElementById(item.name)
  console.log(abstractDiv?.offsetHeight)
  if (abstractDiv && abstractDiv.offsetHeight) {
    abstractHeight = abstractDiv.offsetHeight
  }

  return {
    ...item,
    height: imgHeight + abstractHeight,
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
  transition: 'transform 1s ease',
  cursor: 'pointer',
  '&:hover': {
    zIndex: 999,
    transform: 'scale(1.1)',
  },
}))

function BasicMasonry(props: { width: number; height: number }) {
  const navigate = useNavigate()

  const mobileFlag = useConfigStore((state) => state.mobileFlag)
  const columnCount = mobileFlag ? 2 : 4

  function handleClickItem(item: ComputedItem) {
    if (item.path) {
      navigate(item.path)
    } else {
      alert('还在开发中啦')
    }
  }

  const [computedItems, setComputedItems] = useState<ComputedItem[]>(
    recommendItems.map((item) => getItemDefaultHeight(item, props.width / columnCount - 16)),
  )

  useEffect(() => {
    const tempItems = recommendItems.map((item) => getItemDefaultHeight(item, props.width / columnCount - 16))
    setComputedItems(tempItems)
  }, [props.width, mobileFlag])

  return (
    <Box sx={{ width: props.width, minHeight: 600 }}>
      <Masonry columns={columnCount} spacing={2}>
        {computedItems.map((item, index) => {
          return (
            <Item onClick={() => handleClickItem(item)} key={index} sx={{ height: item.height }}>
              {item.img != null ? (
                <div w-full style={{ height: `${item.imgHeight}px` }}>
                  <img w-full h-full object-contain object-cc src={item.img} />
                </div>
              ) : null}
              <div id={item.name} w-full pb-2 box-border style={{ borderTop: '1px solid var(--bottom-line-color)' }}>
                <div flex justify-center>
                  <div text-lg className='w-4/5'>
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
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const handleResize = (newWidth: number) => {
      if (containerRef.current) {
        setWidth(newWidth)
      }
    }
    const resizeObserver = new ResizeObserver(([entry]) => {
      console.log('resize')
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
      {width === 0 || containerRef.current == null ? null : (
        <BasicMasonry width={width} height={containerRef.current.offsetHeight} />
      )}
    </div>
  )
}
