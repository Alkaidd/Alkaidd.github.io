import './App.css'
import TetrisScreen from './components/Tetris'
import Moyu from './components/Moyu'
import { useMoyuStore } from './hooks/store'

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
  const moyuFlag = useMoyuStore((state) => state.moyuFlag)
  return (
    <div w-full h-full flex items-center justify-center pos-relative>
      {moyuFlag ? <Moyu pos-absolute top-0 left-0 h-full w-full /> : null}
      <TetrisScreen />
    </div>
  )
}

export default App
