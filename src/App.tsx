import './App.css'
// import TetrisScreen from './components/Tetris'
import Moyu from './components/Moyu'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './views/Home'
import { useEffect } from 'react'
import Page404 from './views/Page404'
import GameDistribution from './views/Game'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 检查当前路径是否为根路径
    if (location.pathname === '/') {
      navigate('/home')
    }
  }, [location.pathname, navigate])

  return (
    <div w-100vw h-100vh overflow-hidden flex items-center justify-center pos-relative>
      <Moyu />
      <Routes>
        <Route path='/home/*' element={<Home />} />
        <Route path='/moyu/*' element={<GameDistribution />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </div>
  )
}

export default App
