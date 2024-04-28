import './App.css'
// import TetrisScreen from './components/Tetris'
import Moyu from './components/Moyu'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './views/Home'
import { useEffect } from 'react'
import Page404 from './views/Page404'
import GameDistribution from './views/Game'
import Article from './views/Article'
import { isMobile } from './utils/tools'
import { changeCssVar } from './utils/theme'

function App() {
  useEffect(() => {
    const handleIsMobile = () => {
      changeCssVar(isMobile())
    }

    const resizeObserver = new ResizeObserver(() => {
      handleIsMobile()
    })

    resizeObserver.observe(window.document.body)

    return () => {
      resizeObserver.unobserve(window.document.body)
    }
  })

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
      {import.meta.env.MODE === 'development' ? null : <Moyu />}
      <Routes>
        <Route path='/home/*' element={<Home />} />
        <Route path='/moyu/*' element={<GameDistribution />} />
        <Route path='/article/*' element={<Article />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </div>
  )
}

export default App
