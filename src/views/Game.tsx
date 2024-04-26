import NavTitle from '@/components/NavTitle'
import TetrisScreen from '@/components/games/Tetris'
import { Routes, Route } from 'react-router-dom'

export default function GameDistribution() {
  return (
    <div w-full h-full pt-20 box-border>
      <NavTitle title='这里是鱼塘。' />
      <Routes>
        <Route path='tetris' element={<TetrisScreen />} />
      </Routes>
    </div>
  )
}
