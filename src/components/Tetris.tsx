// 12 * 20

import { genMatrix, horizontalFlip, PixelType, rotateMatrix } from '@/utils/tools'
import { useEffect, useRef, useState } from 'react'
import Tick from '@/utils/tick'
import { useMoyuStore } from '@/hooks/store'

const width = 12
const height = 24
// let matrixCopy = genMatrix(height, width)

const CUBEKEY = {
  1: 'I',
  2: 'L',
  3: 'O',
  4: 'T',
  5: 'Z',
} as const
const CUBE = {
  I: [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  L: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
} as const
type CubeShape = (typeof CUBE)[keyof typeof CUBE]

function getRandomCube(): CubeShape {
  const num1 = (Math.floor(Math.random() * 5) + 1) as keyof typeof CUBEKEY
  const num2 = Math.floor(Math.random() * 4)
  const num3 = Math.floor(Math.random() * 2)
  let newMatrix = rotateMatrix(CUBE[CUBEKEY[num1]] as unknown as number[][], num2 * 90)
  if (num3 === 1) {
    newMatrix = horizontalFlip(newMatrix)
  }
  return newMatrix as unknown as CubeShape
}

function checkMatrixOneRow(screen: PixelType[][]): number {
  let n = 0
  screen.forEach((row) => {
    const res = row.every((cell) => cell.value === 1)
    if (res) {
      n++
    }
  })
  return n
}

function checkRow(row: PixelType[], clearBed: boolean) {
  let hasZero = false
  let hasOne = false
  return row.some((cell) => {
    if (cell.type === 'fish') {
      return false
    }
    if (cell.value === 1) {
      hasOne = true
    } else {
      hasZero = true
    }
    if (clearBed) {
      return hasOne && hasZero
    }
    return hasOne
  })
}

function checkRenderCubes(x: number, y: number, cube: CubeShape, screen: PixelType[][]) {
  for (let rowIndex = cube.length - 1; rowIndex >= 0; rowIndex--) {
    for (let columnIndex = cube[rowIndex].length - 1; columnIndex >= 0; columnIndex--) {
      if (y + rowIndex >= screen.length && cube[rowIndex][columnIndex] === 1) {
        return false
      }
      if (cube[rowIndex][columnIndex] === 1 && !screen[y + rowIndex][x + columnIndex]) {
        return false
      }
      if (
        cube[rowIndex][columnIndex] === 1 &&
        screen[y + rowIndex][x + columnIndex].value === 1 &&
        screen[y + rowIndex][x + columnIndex].type === 'riverbed'
      ) {
        return false
      }
    }
  }
  return true
}

function renderCubes(x: number, y: number, cube: CubeShape, screen: PixelType[][], status: PixelType['type'] = 'fish') {
  for (let rowIndex = cube.length - 1; rowIndex >= 0; rowIndex--) {
    for (let columnIndex = cube[rowIndex].length - 1; columnIndex >= 0; columnIndex--) {
      if (
        (y + rowIndex < screen.length &&
          cube[rowIndex][columnIndex] === 1 &&
          screen[y + rowIndex][x + columnIndex]?.value === 0) ||
        screen[y + rowIndex]?.[x + columnIndex]?.type === 'fish'
      ) {
        screen[y + rowIndex][x + columnIndex].value = cube[rowIndex][columnIndex]
        screen[y + rowIndex][x + columnIndex].type = status
      }
    }
  }
}

function checkMatrix(screen: PixelType[][], clearBed: boolean) {
  const newRows: PixelType[][] = []
  screen.forEach((row) => {
    if (checkRow(row, clearBed)) {
      newRows.push(structuredClone(row))
    }
  })
  newRows.reverse()
  while (newRows.length < screen.length) {
    newRows.push(
      new Array(width).fill(null).map(() => {
        return {
          value: 0,
          type: 'riverbed',
        }
      }),
    )
  }
  newRows.reverse()
  return newRows
}

function killFish(screen: PixelType[][]) {
  screen.forEach((row) =>
    row.forEach((item) => {
      if (item.type === 'fish') {
        item.type = 'riverbed'
      }
    }),
  )
}

function fishing(screen: PixelType[][]) {
  screen.forEach((row) =>
    row.forEach((item) => {
      if (item.type === 'fish') {
        item.value = 0
        item.type = 'riverbed'
      }
    }),
  )
}

function cubePostionLegal(x: number, y: number, cube: CubeShape, screen: PixelType[][]) {
  // x left
  // y top
  // cube
  // screen matrix
  // if (x + cube[0].length > screen[0].length || y + cube.length > screen.length) {
  //   return false
  // }
  return checkRenderCubes(x, y, cube, screen)
}

export default function TetrisScreen() {
  const args = useRef<GameStatus>({
    cubeInitX: 3,
    cubeInitY: 0,
    nextCube: getRandomCube(),
    cube: CUBE['O'],
    addSpeed: 0,
    currentSpeed: 1,
    fullSpeed: 10,
    speedStep: 0.0005,
    lastTickTime: 0,
    moveYFlag: true,
    pause: true,
    score: 0,
    renderCubeFlag: false,
    lastScreen: genMatrix(height, width),
    gameStatus: 'waiting',
  })

  const initArgs = () => {
    args.current.cubeInitX = 3
    args.current.cubeInitY = 0
    args.current.cube = args.current.nextCube
    args.current.nextCube = getRandomCube()
    args.current.renderCubeFlag = true
  }

  const clearScreen = () => {
    tick.current.stop()
    args.current.score = 0
    args.current.currentSpeed = 1
    args.current.addSpeed = 0
    args.current.lastScreen = genMatrix(height, width)
    initArgs()
    tickEvent()
  }

  const checkGameEnd = () => {
    if (args.current.lastScreen[3].some((cell) => cell.value === 1 && cell.type === 'riverbed')) {
      args.current.gameStatus = 'end'
      window.alert(`GAME OVER! SCORE: ${Math.floor(args.current.score)}`)
      clearScreen()
      args.current.gameStatus = 'waiting'
      return true
    }
    return false
  }

  const [matrix, setMatrix] = useState(args.current.lastScreen)

  const tickEvent = (_?: any, nowTicktime?: number) => {
    if (checkGameEnd()) {
      return
    }
    let score = checkMatrixOneRow(args.current.lastScreen)
    if (score > 0) {
      // 1.1 多行奖励系数; 100基础倍率; 当前速度系数; 难度奖励;
      score = 1.1 ** (score - 1) * score * 100 * args.current.currentSpeed * (args.current.fullSpeed / 10)
    }
    const newMatrix = checkMatrix(args.current.lastScreen, false)
    if (args.current.renderCubeFlag) {
      if (nowTicktime && args.current.currentSpeed < args.current.fullSpeed && args.current.lastTickTime >= 1000) {
        args.current.currentSpeed += args.current.speedStep
      }
      if (
        !nowTicktime ||
        nowTicktime - args.current.lastTickTime >= 1000 / (args.current.addSpeed + args.current.currentSpeed)
      ) {
        args.current.score += score
        if (nowTicktime) {
          args.current.lastTickTime = nowTicktime
          if (args.current.moveYFlag) {
            args.current.cubeInitY++
            args.current.moveYFlag = false
          }
        }
        if (cubePostionLegal(args.current.cubeInitX, args.current.cubeInitY, args.current.cube, newMatrix)) {
          fishing(newMatrix)
          renderCubes(args.current.cubeInitX, args.current.cubeInitY, args.current.cube, newMatrix, 'fish')
          args.current.moveYFlag = true
        } else {
          // args.current.cubeInitY--
          args.current.renderCubeFlag = false
          killFish(args.current.lastScreen)

          args.current.lastScreen = checkMatrix(args.current.lastScreen, true)
          setMatrix(args.current.lastScreen)
          return
        }
      } else {
        return
      }
    } else {
      initArgs()
      tick.current.start()
    }

    if (JSON.stringify(newMatrix) !== JSON.stringify(args.current.lastScreen)) {
      // console.log('rerender')
      args.current.lastScreen = newMatrix
      setMatrix(newMatrix)
    }
  }

  const tick = useRef(new Tick(tickEvent))

  const [mode, setMode] = useState<GameMode>('normal')
  function changeMode(mode: GameMode) {
    if (mode === 'easy') {
      args.current.fullSpeed = 10
      args.current.speedStep = 0.0002
    } else if (mode === 'normal') {
      args.current.fullSpeed = 12
      args.current.speedStep = 0.0004
    } else if (mode === 'hard') {
      args.current.fullSpeed = 14
      args.current.speedStep = 0.0006
    }
    setMode(mode)
  }

  const moOrNot = useMoyuStore((state) => state.moOrNot)
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      if (args.current.pause) {
        moOrNot(false)
        args.current.gameStatus = 'pending'
        args.current.pause = false
        tick.current.start()
      } else {
        moOrNot(true)
        args.current.pause = true
        tick.current.stop()
      }
    }
    if (args.current.pause) {
      return
    }
    if (event.key === 'ArrowUp') {
      // 上箭头键
      const newCube = rotateMatrix(args.current.cube as unknown as number[][], 90) as unknown as CubeShape
      if (cubePostionLegal(args.current.cubeInitX, args.current.cubeInitY, newCube, args.current.lastScreen)) {
        args.current.cube = newCube as unknown as CubeShape
        tickEvent()
      }
    } else if (event.key === 'ArrowDown') {
      // 下箭头键
      args.current.addSpeed = args.current.fullSpeed
    } else if (event.key === 'ArrowLeft') {
      // 左箭头键
      const newX = args.current.cubeInitX - 1
      if (cubePostionLegal(newX, args.current.cubeInitY, args.current.cube, args.current.lastScreen)) {
        args.current.cubeInitX = newX
        tickEvent()
      }
    } else if (event.key === 'ArrowRight') {
      // 右箭头键
      const newX = args.current.cubeInitX + 1
      if (cubePostionLegal(newX, args.current.cubeInitY, args.current.cube, args.current.lastScreen)) {
        args.current.cubeInitX = newX
        tickEvent()
      }
    }
    // 这里可以添加处理其他按键的逻辑
  }

  function onKeyUp(event: KeyboardEvent) {
    if (args.current.pause) {
      return
    }
    if (event.key === 'ArrowDown') {
      args.current.addSpeed = 0
    }
  }

  useEffect(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.addEventListener('keydown', onKeyDown)

    //
    window.removeEventListener('keyup', onKeyUp)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  })

  return (
    <div flex items-center>
      <div>
        <div flex items-center>
          <button
            onClick={() => {
              clearScreen()
            }}>
            clear
          </button>
          <button
            onClick={() => {
              args.current.pause = true
              tick.current.stop()
            }}>
            pause
          </button>
          <button
            onClick={() => {
              args.current.gameStatus = 'pending'
              args.current.pause = false
              tick.current.start()
            }}>
            start
          </button>
          <div ml-10 w-30>
            <ScoreCard score={args.current.score} />
          </div>
        </div>
        <div flex flex-col w-fit border-2 border-solid border-light>
          {matrix.slice(4).map((column, columnIndex) => (
            <ul key={`${column}_${columnIndex}`} list-none flex>
              {column.map((cell, rowIndex) => (
                <li key={rowIndex}>
                  {cell.value === 1 ? (
                    <div bg-black h-5 w-5 border-1 border-solid border-gray></div>
                  ) : (
                    <div bg-white h-5 w-5 border-1 border-solid border-gray></div>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div ml-10>
        <div w-40 h-40 flex items-center justify-center>
          <CurrentCube cubeMatrix={args.current.nextCube as unknown as number[][]} />
        </div>
        <div w-50 flex flex-col mb-5>
          <div mb-5>
            <CurrentModeCard mode={mode} />
          </div>
          <div mb-1>mode: </div>
          <button ml-5 mb-2 w-30 onClick={() => changeMode('easy')} disabled={args.current.gameStatus !== 'waiting'}>
            easy
          </button>
          <button ml-5 mb-2 w-30 onClick={() => changeMode('normal')} disabled={args.current.gameStatus !== 'waiting'}>
            normal
          </button>
          <button ml-5 mb-2 w-30 onClick={() => changeMode('hard')} disabled={args.current.gameStatus !== 'waiting'}>
            hard
          </button>
        </div>
        <div>
          <div>↑：旋转</div>
          <div>←：左移</div>
          <div>→：右移</div>
          <div>↓：加速</div>
          <div>[space]：start/pause</div>
        </div>
      </div>
    </div>
  )
}

function ScoreCard({ score }: { score: number }) {
  return (
    <>
      <span w-full>score: {Math.floor(score)}</span>
    </>
  )
}

function CurrentModeCard(props: { mode: string }) {
  return (
    <>
      current mode: <span color-blue>{props.mode}</span>
    </>
  )
}

function CurrentCube({ cubeMatrix }: ICurrentCube) {
  return (
    <div flex flex-col w-fit border-2 border-solid border-light>
      {cubeMatrix.map((column, columnIndex) => (
        <ul key={`${column}_${columnIndex}`} list-none flex>
          {column.map((cell, rowIndex) => (
            <li key={rowIndex}>
              {cell === 1 ? (
                <div bg-black h-5 w-5 border-1 border-solid border-gray></div>
              ) : (
                <div bg-white h-5 w-5 border-1 border-solid border-gray></div>
              )}
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

type GameMode = 'easy' | 'normal' | 'hard'
type ICurrentCube = {
  cubeMatrix: number[][]
}
type GameStatus = {
  cubeInitX: number
  cubeInitY: number
  nextCube: CubeShape
  cube: CubeShape
  addSpeed: number
  currentSpeed: number
  fullSpeed: number
  speedStep: number
  lastTickTime: number
  moveYFlag: boolean
  pause: boolean
  score: number
  renderCubeFlag: boolean
  lastScreen: PixelType[][]
  gameStatus: 'waiting' | 'pending' | 'end'
}
