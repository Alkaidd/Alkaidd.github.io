export default function JoyConMini({
  onButton1Down,
  onButton2Down,
  onArrowUP,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
}: Record<
  'onButton1Down' | 'onButton2Down' | 'onArrowUP' | 'onArrowDown' | 'onArrowLeft' | 'onArrowRight',
  () => void
>) {
  return (
    <div w-full h-fit p-2 mt-5 box-border border-solid border-2 rounded-2>
      <div flex w-full justify-between items-center>
        <div w-30 h-30 pos-relative>
          <button w-15 h-15 rounded-full pos-absolute top-0 left-0 onPointerDown={onButton1Down}>
            pause
          </button>
          <button w-15 h-15 rounded-full pos-absolute bottom-0 right-0 onPointerDown={onButton2Down}>
            start
          </button>
        </div>
        <div w-55 h-40 pos-relative>
          <button pos-absolute w-15 h-10 top-0 left-20 rounded-full onPointerDown={onArrowUP}>
            ↑
          </button>
          <button pos-absolute w-15 h-10 top-15 right-0 rounded-full onPointerDown={onArrowRight}>
            →
          </button>
          <button pos-absolute w-15 h-10 bottom-0 left-20 rounded-full onPointerDown={onArrowDown}>
            ↓
          </button>
          <button pos-absolute w-15 h-10 top-15 left-0 rounded-full onPointerDown={onArrowLeft}>
            ←
          </button>
        </div>
      </div>
    </div>
  )
}
