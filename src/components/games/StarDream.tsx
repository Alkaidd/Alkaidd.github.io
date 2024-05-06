import { Application, Assets, Renderer, Sprite } from 'pixi.js'
import { useEffect, useRef } from 'react'
import JoyConMini from './JoyConMini'
import { useConfigStore } from '@/hooks/store'

export default function StarDream() {
  const pixiContainer = useRef<HTMLDivElement | null>(null)
  const app = useRef<Application<Renderer>>()

  useEffect(() => {
    app.current = new Application()

    async function initApp(app: Application<Renderer>) {
      console.log('try load pixi')
      if (!pixiContainer.current || !app) {
        console.error('no target container or generate pixi app failed')
        return
      }

      await app.init({ background: '#1099bb', resizeTo: pixiContainer.current })
      pixiContainer.current.appendChild(app.canvas)

      const texture = await Assets.load('https://pixijs.com/assets/bunny.png')

      // Create a new Sprite from an image path.
      const bunny = new Sprite(texture)

      // Add to stage.
      app.stage.addChild(bunny)

      // Center the sprite's anchor point.
      bunny.anchor.set(0.5)

      // Move the sprite to the center of the screen.
      bunny.x = app.screen.width / 2
      bunny.y = app.screen.height / 2

      app.ticker.add((time) => {
        bunny.rotation += 0.1 * time.deltaTime
      })
    }

    initApp(app.current)

    return () => {
      // app.destroy()
    }
  }, [app])

  function onKeyDown() {}

  function onKeyUp() {}

  useEffect(() => {
    if (!mobileFlag) {
      window.removeEventListener('keydown', onKeyDown)
      window.addEventListener('keydown', onKeyDown)

      //
      window.removeEventListener('keyup', onKeyUp)
      window.addEventListener('keyup', onKeyUp)
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      // clearScreen()
    }
  }, [])

  const mobileFlag = useConfigStore((state) => state.mobileFlag)

  return (
    <div w-full h-full flex flex-col>
      <div w-full min-h-0 flex-1>
        <div w-full h-full ref={pixiContainer}></div>
      </div>
      {mobileFlag ? (
        <JoyConMini
          onButton1Down={() => void 0}
          onButton2Down={() => void 0}
          onArrowUP={() => void 0}
          onArrowDown={() => void 0}
          onArrowLeft={() => void 0}
          onArrowRight={() => void 0}
        />
      ) : null}
    </div>
  )
}
