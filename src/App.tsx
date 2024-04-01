import './App.css'
import TetrisScreen from './components/Tetris'
import Moyu from './components/Moyu'

function polyfill() {
  // @ts-expect-error do polyfill
  if (window.structuredClone) {
    return
  }
  window.structuredClone = (val: any) => {
    return JSON.parse(JSON.stringify(val))
  }
}
polyfill()

function App() {
  return (
    <div w-full h-full flex items-center justify-center pos-relative>
      <Moyu />
      <TetrisScreen />
    </div>
  )
}

export default App
