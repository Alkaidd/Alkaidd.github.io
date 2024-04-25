import NavTitle from '@/components/NavTitle'
import TetrisScreen from '@/components/Tetris'
import { Routes, Route } from 'react-router-dom'

export default function GameDistribution() {
  return (
    <div w-full h-full pt-40>
      <NavTitle title='这里是鱼塘。' />
      <Routes>
        <Route path='tetris' element={<TetrisScreen />} />
      </Routes>
    </div>
  )
}