import { useMoyuStore } from '@/hooks/store'
import { useEffect } from 'react'

export default function Moyu() {
  const moyuFlag = useMoyuStore((state) => state.moyuFlag)
  const moOrNot = useMoyuStore((state) => state.moOrNot)

  useEffect(() => {
    function onKeySpaceDown(event: KeyboardEvent) {
      if (event.key === ' ') {
        moOrNot()
      }
    }
    window.addEventListener('keydown', onKeySpaceDown)
    return () => {
      window.removeEventListener('keydown', onKeySpaceDown)
    }
  }, [])
  return (
    <div
      pos-absolute
      z-1009
      top-0
      left-0
      h-full
      w-full
      bg-no-repeat
      bg-cover
      bg-top
      style={{ backgroundImage: 'url("/static/zustand.png")', display: moyuFlag ? 'block' : 'none' }}></div>
  )
}
