export function genMatrix(x: number, y: number): PixelType[][] {
  return new Array(x).fill(null).map(() =>
    new Array(y).fill(null).map(() => {
      return {
        value: 0,
        type: 'riverbed',
      }
    }),
  )
}

function swap(a: number[], i: number, j: number) {
  const temp = a[i]
  a[i] = a[j]
  a[j] = temp
}

export function horizontalFlip(matrix: number[][]) {
  const rows = matrix.length
  const cols = matrix[0].length
  const flippedMatrix = JSON.parse(JSON.stringify(matrix)) // 创建矩阵的深拷贝

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols / 2; j++) {
      swap(flippedMatrix[i], j, cols - 1 - j)
    }
  }

  return flippedMatrix
}

export function rotateMatrix(matrix: number[][], degrees: number): number[][] {
  const newMatrix = structuredClone(matrix)
  const n = newMatrix.length
  const rotations = Math.floor(degrees / 90) % 4

  // 根据旋转次数进行旋转
  for (let r = 0; r < rotations; r++) {
    // 顺时针旋转90度
    for (let i = 0; i < n / 2; i++) {
      for (let j = i; j < n - i - 1; j++) {
        const temp = newMatrix[i][j]
        newMatrix[i][j] = newMatrix[n - 1 - j][i]
        newMatrix[n - 1 - j][i] = newMatrix[n - 1 - i][n - 1 - j]
        newMatrix[n - 1 - i][n - 1 - j] = newMatrix[j][n - 1 - i]
        newMatrix[j][n - 1 - i] = temp
      }
    }

    // 如果需要旋转180度，则再次执行90度旋转
    if (rotations === 2) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n / 2; j++) {
          swap(newMatrix[i], j, n - 1 - j)
        }
      }
    }
  }

  return newMatrix
}

export const isMobile = function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function genTextByTick(text: string, step: number, cb: (text: string) => void) {
  let newText = ''
  let timer = setTimeout(() => void 0)
  const setNewText = () => {
    const newCha = text[newText.length]
    const newStep = step + (Math.random() * 0.4 - 0.2) * step
    if (newText.length < text.length) {
      newText += newCha
      if (newCha.match(/[\u{FF0C}\u{FF0E}\u{FF01}\u{FF1F},.!?]+/u)) {
        timer = setTimeout(setNewText, newStep * 3)
      } else {
        timer = setTimeout(setNewText, newStep)
      }
    } else if (newText.length === text.length) {
      newText += ' '
      timer = setTimeout(setNewText, step * 20)
    } else {
      newText = ''
      timer = setTimeout(setNewText, newStep)
    }
    cb(newText)
  }

  setNewText()

  return () => {
    clearTimeout(timer)
  }
}

export function getRandomNumber(number: number) {
  return Math.floor(Math.random() * number)
}

export function isJumpOnTop(pairs: Matter.Pair[], targetName: string): boolean {
  return pairs.some((item) => {
    if (item.bodyA.label !== targetName && item.bodyB.label !== targetName) {
      return false
    }

    const target = item.bodyA.label === targetName ? item.bodyA.bounds : item.bodyB.bounds
    const jinx = item.bodyA.label === targetName ? item.bodyB.bounds : item.bodyA.bounds

    // matter y轴正方向向下
    if (jinx.min.y - target.max.y < 0.1 && target.max.x > jinx.min.x && target.min.x < jinx.max.x) {
      return true
    }
  })
}

export type PixelType = { value: number; type: 'riverbed' | 'fish' }
