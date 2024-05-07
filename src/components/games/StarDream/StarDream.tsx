import { Application, Assets, Graphics, Renderer, Sprite } from 'pixi.js'
import { useEffect, useRef } from 'react'
import JoyConMini from '../JoyConMini'
import { useConfigStore } from '@/hooks/store'
import Bunny from './bunny'
import { Engine, Runner } from 'matter-js'
import { engine, genGround } from './matter'

const myBunny: Bunny = new Bunny()
let app: Application | null = null
let initFlag = false

async function initApp(container: HTMLDivElement) {
  if (!container) {
    console.error('no target container')
    return
  }

  if (app) {
    console.info('app already created')
  } else {
    app = new Application()
    initFlag = true
    await app.init({ background: '#1099bb', resizeTo: container })
    initFlag = false
  }

  if (!container.querySelector('canvas') && !initFlag) {
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

  return app
}

export default function StarDream() {
  const pixiContainer = useRef<HTMLDivElement | null>(null)
  // const app = useRef<Application<Renderer>>()
  // matter

  useEffect(() => {
    if (pixiContainer.current) {
      initApp(pixiContainer.current)
    }
    return () => {
      // app.destroy()
    }
  }, [])

  const keyStatus = useRef({
    ArrowLeft: false,
    ArrowRight: false,
  })
  const arrowUp = () => {
    myBunny.jump()
  }
  const arrowLeft = () => {
    keyStatus.current.ArrowLeft = true
    myBunny.move(-1)
  }
  const arrowRight = () => {
    keyStatus.current.ArrowRight = true
    myBunny.move(1)
  }
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      arrowUp()
    } else if (event.key === 'ArrowLeft') {
      arrowLeft()
    } else if (event.key === 'ArrowRight') {
      arrowRight()
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      keyStatus.current.ArrowLeft = false
    } else if (event.key === 'ArrowRight') {
      keyStatus.current.ArrowRight = false
    }

    if (!keyStatus.current.ArrowLeft && !keyStatus.current.ArrowRight) {
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
          onArrowUP={() => arrowUp()}
          onArrowDown={() => void 0}
          onArrowLeft={() => void 0}
          onArrowRight={() => void 0}
        />
      ) : null}
    </div>
  )
}
