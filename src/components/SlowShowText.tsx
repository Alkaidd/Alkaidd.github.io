import { genTextByTick } from '@/utils/tools'
import { useEffect, useState } from 'react'

function FlashLine(props: { step: number }) {
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFlag(!flag)
    }, props.step)

    return () => {
      clearInterval(timer)
    }
  })
  return <>{flag ? null : <span>_</span>}</>
}

export default function SlowShowText(props: { text: string; step?: number }) {
  const [text, setText] = useState('')

  useEffect(() => {
    const clear = genTextByTick(props.text, props.step ?? 200, (temp) => {
      setText(temp)
    })

    return () => {
      clear()
    }
  }, [props.text, props.step])

  return (
    <span>
      <span>{text}</span>
      {text.length >= props.text.length ? null : <FlashLine step={props.step ? props.step * 0.75 : 150} />}
    </span>
  )
}
