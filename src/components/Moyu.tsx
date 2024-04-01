import { useMoyuStore } from '@/hooks/store'

export default function Moyu() {
  const moyuFlag = useMoyuStore((state) => state.moyuFlag)
  return (
    <div
      pos-absolute
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
