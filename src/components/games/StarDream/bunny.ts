import Matter, { Bodies, Body, Events, IEventCollision, Pairs } from 'matter-js'
import { Graphics } from 'pixi.js'
import { composite, engine } from './matter'
import { isJumpOnTop } from '@/utils/tools'

export default class Bunny {
  body: Matter.Body
  box: Graphics
  jumpStatus: number
  maxJumpCounts: number
  moveDirection: number
  moveFlag: boolean

  constructor() {
    this.jumpStatus = 0
    this.maxJumpCounts = 2
    this.moveDirection = 0
    this.moveFlag = false

    this.body = Bodies.rectangle(400, 200, 80, 80, {
      mass: 60,
      restitution: 0.1,
    })
    this.body.label = 'rabbit'

    const box = new Graphics().rect(0, 0, 80, 80).fill(0xff0000)

    box.x = this.body.position.x
    box.y = this.body.position.y
    box.pivot.set(40, 40)
    this.box = box
    composite(this.body)
  }

  ticker() {
    this.box.x = this.body.position.x
    this.box.y = this.body.position.y
    this.box.rotation = this.body.angle
    // console.log(this.body.velocity)
  }

  lockSpeedMove = () => {
    if (this.moveDirection > 0) {
      Body.setVelocity(this.body, { x: 10, y: this.body.velocity.y })
      // this.body.velocity.x = 10
    } else if (this.moveDirection < 0) {
      Body.setVelocity(this.body, { x: -10, y: this.body.velocity.y })
      // this.body.velocity.x = -10
    }
  }

  move(x: number) {
    this.moveDirection = x
    if (!this.moveFlag) {
      Events.on(engine, 'beforeUpdate', this.lockSpeedMove)
      this.moveFlag = true
    }
  }

  lockJump = (event: IEventCollision<any>) => {
    console.log(event.pairs)
    if (this.jumpStatus >= this.maxJumpCounts && isJumpOnTop(event.pairs, this.body.label)) {
      console.log('jump unlock')
      Events.off(engine, 'collisionStart', this.lockJump)
      this.jumpStatus = 0
    }
  }

  jump() {
    console.log(this.jumpStatus)
    if (this.jumpStatus >= this.maxJumpCounts) {
      return
    }
    Body.setVelocity(this.body, { x: this.body.velocity.x, y: -30 })
    this.jumpStatus += 1
    Events.on(engine, 'collisionStart', this.lockJump)
  }

  stop() {
    this.moveDirection = 0
    this.moveFlag = false
    Body.setVelocity(this.body, { x: 0, y: this.body.velocity.y })
    Events.off(engine, 'beforeUpdate', this.lockSpeedMove)
  }
}
