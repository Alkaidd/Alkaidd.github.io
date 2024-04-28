import { useMoyuStore } from '@/hooks/store'
import Tick from '@/utils/tick'
import { getRandomNumber, isMobile } from '@/utils/tools'
import { useEffect, useRef, useState } from 'react'

class Snake {
  // 0: space
  // 1: snake
  // 2: food
  screen: number[][]
  snake: { position: { x: number; y: number } }[]
  food: { position: { x: number; y: number } }
  snakeMap: Record<string, boolean>
  // excuteList: Array<() => void>
  snakeDirection: 'top' | 'right' | 'left' | 'bottom'
  gameOver: boolean

  constructor(x: number, y: number) {
    this.screen = new Array(x).fill(null).map(() => new Array(y).fill(0))
    this.snake = [{ position: { x: getRandomNumber(x), y: getRandomNumber(y) } }]
    this.snakeMap = this.getSnakeMap()
    this.food = this.genFood(x, y)
    this.snakeDirection = 'top'
    this.gameOver = false
  }

  reset() {
    this.clearScreen(true)
    const x = this.screen.length
    const y = this.screen[0].length
    this.snake = [{ position: { x: getRandomNumber(x), y: getRandomNumber(y) } }]
    this.snakeMap = this.getSnakeMap()
    this.food = this.genFood(x, y)
    this.snakeDirection = 'top'
    this.gameOver = false
  }

  getSnakeMap() {
    const tempMap: Snake['snakeMap'] = {}
    this.snake.forEach((node) => {
      tempMap[`${node.position.x}${node.position.y}`] = true
    })
    return tempMap
  }

  genFood(x: number, y: number) {
    let position = this.genRandomPosition(x, y)
    while (Reflect.has(this.snakeMap, `${position.x}${position.y}`)) {
      position = this.genRandomPosition(x, y)
    }
    return { position }
  }

  genRandomPosition(xLimit: number, yLimit: number) {
    const x = getRandomNumber(xLimit)
    const y = getRandomNumber(yLimit)
    return { x, y }
  }

  clearScreen(flag?: boolean) {
    if (flag) {
      this.screen.forEach((column) => {
        column.forEach((cell, rawIndex) => {
          column[rawIndex] = 0
        })
      })
      return
    }
    this.screen[this.food.position.x][this.food.position.y] = 0

    this.snake.forEach((node) => {
      this.screen[node.position.x][node.position.y] = 0
    })
  }

  composeScreen() {
    this.screen[this.food.position.x][this.food.position.y] = 2

    this.snake.forEach((node) => {
      this.screen[node.position.x][node.position.y] = 1
    })

    return this.screen
  }

  start() {
    return this.composeScreen()
  }

  next() {
    this.clearScreen()
    const tail = this.snake[this.snake.length - 1]
    this.moveSnake(this.snakeDirection)
    this.snakeMap = this.getSnakeMap()
    if (this.snakeMap[`${this.food.position.x}${this.food.position.y}`]) {
      this.snake.push(tail)
      this.food = this.genFood(this.screen.length, this.screen[0].length)
    }
    return this.composeScreen()
  }

  moveSnake(direction: Snake['snakeDirection'] | null): Snake['snake'] {
    if (direction == null) {
      return []
    }

    const head = structuredClone(this.snake[0])
    // const snakeMap = this.getSankeMap()

    switch (direction) {
      case 'top':
        head.position.x -= 1
        break
      case 'right':
        head.position.y += 1
        break
      case 'left':
        head.position.y -= 1
        break
      case 'bottom':
        head.position.x += 1
        break
    }

    if (head.position.x < 0 || head.position.x >= this.screen.length) {
      this.gameOver = true
      return []
    }
    if (head.position.y < 0 || head.position.y >= this.screen[0].length) {
      this.gameOver = true
      return []
    }

    if (this.snake.length < 2) {
      this.snake[0] = head
      return this.snake
    }

    // 无法移动的方向
    if (this.snake[1].position.x === head.position.x && this.snake[1].position.y === head.position.y) {
      return []
    }

    // 吃到自己身体了
    if (this.snakeMap[`${head.position.x}${head.position.y}`]) {
      this.gameOver = true
      return []
    }

    this.snake.pop()
    this.snake.unshift(head)

    return this.snake
  }
}

const snake = new Snake(24, 12)
export default function SnakeGame() {
  const [screen, setScreen] = useState(structuredClone(snake.screen))
  useEffect(() => {
    resetGame()
  }, [])

  const args = useRef({
    lastTickTime: 0,
    currentSpeed: 1,
    fullSpeed: 10,
    speedStep: 0.0005,
    pause: true,
    gameStatus: 'waiting',
  })
  const snakeMove = (nowTicktime: number) => {
    snake.next()
    const newScreenStr = JSON.stringify(snake.screen)
    if (newScreenStr !== JSON.stringify(screen)) {
      setScreen(JSON.parse(newScreenStr))
    }
    args.current.lastTickTime = nowTicktime
    if (snake.gameOver) {
      tick.current?.stop()
      alert('game over')
      resetGame()
    }
  }
  const tickEvent = (_: number, nowTicktime: number) => {
    if (nowTicktime && args.current.currentSpeed < args.current.fullSpeed && args.current.lastTickTime >= 1000) {
      args.current.currentSpeed += args.current.speedStep
    }
    if (nowTicktime - args.current.lastTickTime > 1000 / args.current.currentSpeed) {
      snakeMove(nowTicktime)
    }
  }
  const tick = useRef<Tick | null>(null)
  if (tick.current === null) {
    tick.current = new Tick(tickEvent)
  }
  function resetGame() {
    snake.reset()
    snake.start()
    setScreen(structuredClone(snake.screen))
  }

  const moOrNot = useMoyuStore((state) => state.moOrNot)
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      if (args.current.pause) {
        moOrNot(false)
        args.current.gameStatus = 'pending'
        args.current.pause = false
        tick.current?.start()
      } else {
        moOrNot(true)
        args.current.pause = true
        tick.current?.stop()
      }
    }
    if (args.current.pause) {
      return
    }

    if (event.key === 'ArrowUp') {
      // 上箭头键
      snake.snakeDirection = 'top'
    } else if (event.key === 'ArrowDown') {
      // 下箭头键
      snake.snakeDirection = 'bottom'
    } else if (event.key === 'ArrowLeft') {
      // 左箭头键
      snake.snakeDirection = 'left'
    } else if (event.key === 'ArrowRight') {
      // 右箭头键
      snake.snakeDirection = 'right'
    }
    snakeMove(performance.now())
    // 这里可以添加处理其他按键的逻辑
  }

  function onKeyUp(event: KeyboardEvent) {}

  useEffect(() => {
    if (!isMobile()) {
      window.removeEventListener('keydown', onKeyDown)
      window.addEventListener('keydown', onKeyDown)

      //
      window.removeEventListener('keyup', onKeyUp)
      window.addEventListener('keyup', onKeyUp)
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      // clearScreen()
    }
  }, [])
  return (
    <div>
      <div className='snake-screen'>
        {screen.map((column, columnIndex) => (
          <ul key={`${column}_${columnIndex}`} list-none flex>
            {column.map((cell, rowIndex) => (
              <li key={rowIndex}>
                {cell === 0 ? (
                  <div bg-white h-5 w-5 border-1 border-solid border-gray></div>
                ) : cell === 1 ? (
                  <div bg-black h-5 w-5 border-1 border-solid border-gray></div>
                ) : (
                  <div bg-white h-5 w-5 border-1 border-solid border-gray>
                    <div bg-black h-full w-full rounded-2></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
