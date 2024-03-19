// 12 * 20

import { useState } from 'react'

function genMatrix(x: number, y: number): number[][] {
  return new Array(x).fill(null).map(() => new Array(y).fill(0))
}
// const matrix = genMatrix(12, 20)

function TetrisScreen() {
  const [matrix, setMatrix] = useState(genMatrix(12, 20))
  return (
    <div flex>
      {matrix.map((column, columnIndex) => (
        <ul key={`${column}_${columnIndex}`}>
          {column.map((cell, rowIndex) => (
            <li key={rowIndex}>{cell}</li>
          ))}
        </ul>
      ))}
    </div>
  )
}

export default TetrisScreen
