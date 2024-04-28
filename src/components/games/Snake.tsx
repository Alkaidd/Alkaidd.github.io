import { useMoyuStore } from '@/hooks/store'
import Tick from '@/utils/tick'
import { getRandomNumber, isMobile } from '@/utils/tools'
import { useEffect, useRef, useState } from 'react'
import ScoreCard from './ScoreCard'
import JoyConMini from './JoyConMini'
import ScreenContainer from './ScreenContainer'

class Snake {
  // 0: space
  // 1: snake
  // 2: food
  screen: number[][]
  snake: { position: { x: number; y: number } }[]
  food: { position: { x: number; y: number } }
  snakeMap: Record<string, number>
  // excuteList: Array<() => void>
  lastSnakeDirection: 'top' | 'right' | 'left' | 'bottom'
  snakeDirection: 'top' | 'right' | 'left' | 'bottom'
  gameOver: boolean
  overStatus: 'wall' | 'eatSelf' | ''

  constructor(x: number, y: number) {
    this.screen = new Array(x).fill(null).map(() => new Array(y).fill(0))
    this.snake = [{ position: { x: this.getRandomNumberAvoidSides(x), y: this.getRandomNumberAvoidSides(y) } }]
    this.snakeMap = this.getSnakeMap()
    this.food = this.genFood(x, y)
    this.lastSnakeDirection = 'top'
    this.snakeDirection = 'top'
    this.gameOver = false
    this.overStatus = ''
  }

  getRandomNumberAvoidSides(n: number) {
    const rand = getRandomNumber(n)
    return Math.floor(rand / 2) + 3
  }

  reset() {
    this.clearScreen(true)
    const x = this.screen.length
    const y = this.screen[0].length
    this.snake = [{ position: { x: this.getRandomNumberAvoidSides(x), y: this.getRandomNumberAvoidSides(y) } }]
    this.snakeMap = this.getSnakeMap()
    this.food = this.genFood(x, y)
    this.lastSnakeDirection = 'top'
    this.snakeDirection = 'top'
    this.gameOver = false
    this.overStatus = ''
  }

  getSnakeMap() {
    const tempMap: Snake['snakeMap'] = {}
    this.snake.forEach((node, index) => {
      tempMap[`${node.position.x}-${node.position.y}`] = index
    })
    return tempMap
  }

  genFood(x: number, y: number) {
    let position = this.genRandomPosition(x, y)
    while (Reflect.has(this.snakeMap, `${position.x}-${position.y}`)) {
      position = this.genRandomPosition(x, y)
    }
    return { position }
  }

  genRandomPosition(xLimit: number, yLimit: number) {
    const x = getRandomNumber(xLimit)
    const y = getRandomNumber(yLimit)
    return { x, y }
  }

  getNodeIndex(columnIndex: number, rowIndex: number) {
    const index = this.getSnakeMap()[`${columnIndex}-${rowIndex}`]
    return index
  }

  getSnakeBodyStatus(index: number) {
    if (index < 0 || index >= this.snake.length) {
      return []
    }

    if (index === 0) {
      return []
    }

    if (index === this.snake.length - 1) {
      const pre = this.snake[index - 1].position
      const cur = this.snake[index].position
      return [pre.x - cur.x, pre.y - cur.y]
    }

    const pre = this.snake[index - 1].position
    const cur = this.snake[index].position
    const next = this.snake[index + 1].position

    return [pre.x - cur.x, pre.y - cur.y, next.x - cur.x, next.y - cur.y]
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

    let eat = false
    if (Reflect.has(this.snakeMap, `${this.food.position.x}-${this.food.position.y}`)) {
      this.snake.push(tail)
      this.food = this.genFood(this.screen.length, this.screen[0].length)
      eat = true
    }
    this.composeScreen()
    return eat
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
      console.log('crash x wall')
      this.overStatus = 'wall'
      this.gameOver = true
      return []
    }
    if (head.position.y < 0 || head.position.y >= this.screen[0].length) {
      console.log('crash y wall')
      this.overStatus = 'wall'
      this.gameOver = true
      return []
    }

    if (this.snake.length < 2) {
      this.lastSnakeDirection = this.snakeDirection
      this.snake[0] = head
      return this.snake
    }

    // 无法移动的方向
    if (this.snake[1].position.x === head.position.x && this.snake[1].position.y === head.position.y) {
      this.snakeDirection = this.lastSnakeDirection
      this.moveSnake(this.snakeDirection)
      return []
    }

    // 吃到自己身体了
    if (Reflect.has(this.snakeMap, `${head.position.x}-${head.position.y}`)) {
      console.log('eat self')
      this.overStatus = 'eatSelf'

      this.gameOver = true
      return []
    }

    this.lastSnakeDirection = this.snakeDirection

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
    return () => {
      setScreen(structuredClone(snake.screen))
    }
  }, [])

  const args = useRef({
    lastTickTime: 0,
    currentSpeed: 4,
    fullSpeed: 20,
    speedStep: 0.0005,
    score: 0,
    pause: true,
    gameStatus: 'waiting',
  })
  const snakeMove = (nowTicktime: number) => {
    const eat = snake.next()
    if (eat) {
      args.current.score += args.current.currentSpeed * (1 + snake.snake.length / 10) * 20
    }
    const newScreenStr = JSON.stringify(snake.screen)
    if (newScreenStr !== JSON.stringify(screen)) {
      setScreen(JSON.parse(newScreenStr))
    }
    args.current.lastTickTime = nowTicktime
    if (snake.gameOver) {
      tick.current?.stop()
      let info = `GAME OVER! SCORE: ${Math.floor(args.current.score)}`
      if (args.current.score < 30000) {
        if (snake.overStatus === 'wall') {
          info = '别灰心,猪也撞树上了~' + info
        } else if (snake.overStatus === 'eatSelf') {
          info = '别灰心,驴也是这么想的~' + info
        }
      }
      window.alert(info)
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
    args.current.score = 0
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
    <div h-full>
      <div className='snake-screen' h-full w-full flex flex-col items-center w-fit min-h-0>
        <ScoreCard score={args.current.score} />
        <ScreenContainer
          content={() =>
            screen.map((column, columnIndex) => (
              <ul key={`${column}_${columnIndex}`} list-none flex>
                {column.map((cell, rowIndex) => (
                  <li key={rowIndex}>
                    {cell === 0 ? (
                      <div bg-white h-5 w-5 border-1 border-solid border-gray></div>
                    ) : cell === 1 ? (
                      <SnakeNode type={snake.getSnakeBodyStatus(snake.getNodeIndex(columnIndex, rowIndex))} />
                    ) : (
                      <div bg-white h-5 w-5 border-1 border-solid border-gray>
                        <div bg-pink h-full w-full rounded-2></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ))
          }
        />
        {isMobile() ? (
          <JoyConMini
            onButton1Down={() => {
              args.current.pause = true
              tick.current?.stop()
            }}
            onButton2Down={() => {
              args.current.gameStatus = 'pending'
              args.current.pause = false
              tick.current?.start()
            }}
            onArrowUP={() => {
              snake.snakeDirection = 'top'
              snakeMove(performance.now())
            }}
            onArrowDown={() => {
              snake.snakeDirection = 'bottom'
              snakeMove(performance.now())
            }}
            onArrowLeft={() => {
              snake.snakeDirection = 'left'
              snakeMove(performance.now())
            }}
            onArrowRight={() => {
              snake.snakeDirection = 'right'
              snakeMove(performance.now())
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

function SnakeNode({ type }: { type: number[] }) {
  if (type.length === 4) {
    return SnakeBodyNode(type)
  }

  if (type.length === 2) {
    return SnakeTail(type)
  }

  return <div bg-black h-5 w-5 border-1 border-solid border-gray></div>
}

function SnakeTail(type: number[]) {
  const [x, y] = type

  const D = `M 100,100 L ${100 + y * 100},${100 + x * 100}`

  return (
    <div bg-white h-5 w-5 border-1 border-solid border-gray>
      <svg width='100%' height='100%' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
        <path d={D} stroke='black' fill='none' strokeWidth='100'></path>
      </svg>
    </div>
  )
}

function SnakeBodyNode(type: number[]) {
  const [x, y] = [type[0] + type[2], type[1] + type[3]]
  let deg = 0
  if (x === -1 && y === 1) {
    deg = 90
  } else if (x === -1 && y == -1) {
    deg = 360
  } else if (x === 1 && y === -1) {
    deg = 270
  } else if (x === 1 && y === 1) {
    deg = 180
  }

  const isRaw = type[0] === type[2] ? false : true

  return (
    <div bg-white h-5 w-5 border-1 border-solid border-gray style={{ transform: `rotate(${deg}deg)` }}>
      <svg width='100%' height='100%' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
        {deg !== 0 ? (
          // (0, 0)四分之一圆心
          <path d='M 100,0 A 100,100 0,0,1 0,100' stroke='black' fill='none' strokeWidth='140'></path>
        ) : isRaw ? (
          <path d='M 100,0 L 100,200' stroke='black' fill='none' strokeWidth='140'></path>
        ) : (
          <path d='M 0,100 L 200,100' stroke='black' fill='none' strokeWidth='140'></path>
        )}
      </svg>
    </div>
  )
}
