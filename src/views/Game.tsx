import TetrisScreen from '@/components/Tetris'
import { Routes, Route } from 'react-router-dom'

export default function GameDistribution() {
  return (
    <div w-full h-full>
      <Routes>
        <Route path='tetris' element={<TetrisScreen />} />
      </Routes>
    </div>
  )
}
