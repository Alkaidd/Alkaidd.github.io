import './App.css'
import TetrisScreen from './components/Tetris'

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
    <div w-full h-full flex items-center justify-center>
      <TetrisScreen />
    </div>
  )
}

export default App
