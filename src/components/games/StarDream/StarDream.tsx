import { Application, Assets, Graphics, Renderer, Sprite } from 'pixi.js'
import { useEffect, useRef } from 'react'
import JoyConMini from '../JoyConMini'
import { useConfigStore } from '@/hooks/store'
import Bunny from './bunny'
import { Engine, Runner } from 'matter-js'
import { engine, genGround } from './matter'

const myBunny: Bunny = new Bunny()

async function initApp(app: Application<Renderer>, container: HTMLDivElement) {
  console.log('try load pixi')
  if (!container || !app) {
    console.error('no target container or generate pixi app failed')
    return
  }

  await app.init({ background: '#1099bb', resizeTo: container })
  if (!container.querySelector('canvas')) {
    console.log('append canvas')
    container.appendChild(app.canvas)
  } else {
    return
  }

  // gen ground
  // bottom
  genGround(app.screen.width / 2, app.screen.height - 30, app.screen.width, 60)
  // left
  genGround(-30, app.screen.height / 2, 60, app.screen.height)
  // right
  genGround(app.screen.width + 30, app.screen.height / 2, 60, app.screen.height)

  // const texture = await Assets.load('/static/star-dream/bunny.png')

  // // Create a new Sprite from an image path.
  // const bunny = new Sprite(texture)

  // // Add to stage.
  // app.stage.addChild(bunny)

  // // Center the sprite's anchor point.
  // bunny.anchor.set(0.5)

  // // Move the sprite to the center of the screen.
  // bunny.x = app.screen.width / 2
  // bunny.y = app.screen.height / 2

  // test
  // myBunny = new Bunny()
  app.stage.addChild(myBunny.box)

  app.ticker.add((time) => {
    // bunny.rotation += 0.1 * time.deltaTime
    myBunny.ticker()

    Engine.update(engine)
  })
  console.log(engine.gravity)
}

export default function StarDream() {
  const pixiContainer = useRef<HTMLDivElement | null>(null)
  const app = useRef<Application<Renderer>>()
  // matter

  useEffect(() => {
    app.current = new Application()

    pixiContainer.current && initApp(app.current, pixiContainer.current)
    return () => {
      // app.destroy()
    }
  }, [app])

  const keyStatus = useRef({
    ArrowUp: false,
    ArrowDown: false,
  })
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      console.log('bunny jump')
      myBunny.jump()
      console.log(myBunny.body.position)
    }

    if (event.key === 'ArrowRight') {
      keyStatus.current.ArrowUp = true
      myBunny.move(1)
    } else if (event.key === 'ArrowLeft') {
      keyStatus.current.ArrowDown = true
      myBunny.move(-1)
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      keyStatus.current.ArrowUp = false
    } else if (event.key === 'ArrowLeft') {
      keyStatus.current.ArrowDown = false
    }

    if (!keyStatus.current.ArrowUp && !keyStatus.current.ArrowDown) {
      myBunny.stop()
    }
  }

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
