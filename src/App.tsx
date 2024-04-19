import './App.css'
// import TetrisScreen from './components/Tetris'
import Moyu from './components/Moyu'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './views/Home'
import { useEffect } from 'react'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/home')
  }, [navigate])
  return (
    <div w-100vw h-100vh overflow-hidden flex items-center justify-center pos-relative>
      <Moyu />
      <Routes>
        <Route path='/home' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
