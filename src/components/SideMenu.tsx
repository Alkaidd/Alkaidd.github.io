import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const list = [
  {
    name: 'Introduce',
    top: 0,
    rotateZ: 0,
  },
  {
    name: 'Game',
    top: 0,
    rotateZ: 0,
  },
  {
    name: 'Article',
    top: 0,
    rotateZ: 0,
  },
  {
    name: 'Talk',
    top: 0,
    rotateZ: 0,
  },
  {
    name: 'AIGC',
    top: 0,
    rotateZ: 0,
  },
]

// range 0 - 30 deg
function getRandomPosition<T = Record<any, any>>(list: T[]): Array<T & { top: number; rotateZ: number }> {
  const newList: Array<T & { top: number; rotateZ: number }> = []
  list.forEach((item, index) => {
    let randomRotateZ = Math.random() * 40 - 5
    let top = 20
    if (index > 0) {
      top = newList[index - 1].top + 50
      if (randomRotateZ - newList[index - 1].rotateZ > 10) {
        randomRotateZ -= 10
      }
    }

    newList.push({
      ...item,
      top,
      rotateZ: randomRotateZ,
    })
  })

  return newList
}

const menuMap: Record<string, string> = {
  Article: '/article',
  Game: '/moyu',
}

export function SideMenu() {
  const [menuList, setMenuList] = useState(list)
  const [hoverTop, setHoverTop] = useState(0)
  const naviagte = useNavigate()

  function setHoverItemTop(index: number, hover: boolean) {
    if (hover) {
      const temp = menuList[index].top
      menuList[index].top = temp - 60
      setHoverTop(temp)
    } else {
      menuList[index].top = hoverTop
      setHoverTop(0)
    }
  }

  function tidyPaper(flag: boolean) {
    if (flag) {
      setMenuList(menuList.map((item) => ({ ...item, rotateZ: item.rotateZ / 10 })))
    } else {
      setMenuList(getRandomPosition(menuList))
    }
  }

  function clickItemMenu(name: string) {
    if (menuMap[name]) {
      naviagte(menuMap[name])
    } else {
      alert('开发中...')
    }
  }

  useEffect(() => {
    setMenuList(getRandomPosition(menuList).map((item) => ({ ...item, rotateZ: item.rotateZ / 10 })))
  }, [])

  return (
    <div h-full w-full pos-relative onMouseEnter={() => tidyPaper(false)} onMouseLeave={() => tidyPaper(true)}>
      {menuList.map((item, index) => (
        <div
          key={item.name}
          onMouseEnter={() => setHoverItemTop(index, true)}
          onMouseLeave={() => setHoverItemTop(index, false)}
          onClick={() => clickItemMenu(item.name)}
          h-full
          p-2
          pos-absolute
          cursor-pointer
          transform-origin-cc
          border-1
          border-solid
          transition-all
          duration-500
          style={{
            transform: `rotateZ(${item.rotateZ}deg)`,
            top: item.top,
            width: `calc(var(--nav-width) - 20px)`,
            boxShadow: `10px 5px 10px rgba(0, 0, 0, 0.2)`,
            backgroundColor: `rgb(252, 250, 234)`,
            borderColor: `var(--paper-border-color)`,
          }}>
          {item.name}
        </div>
      ))}
    </div>
  )
}
