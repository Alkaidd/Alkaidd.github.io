import NavTitle from '@/components/NavTitle'
import SnakeGame from '@/components/games/Snake'
import StarDream from '@/components/games/StarDream'
import TetrisScreen from '@/components/games/Tetris'
import { Routes, Route } from 'react-router-dom'

export default function GameDistribution() {
  return (
    <div w-full h-full pt-20 box-border>
      <NavTitle title='这里是鱼塘。' />
      <Routes>
        <Route path='tetris' element={<TetrisScreen />} />
        <Route path='snake' element={<SnakeGame />} />
        <Route path='star-dream' element={<StarDream />} />
      </Routes>
    </div>
  )
}
