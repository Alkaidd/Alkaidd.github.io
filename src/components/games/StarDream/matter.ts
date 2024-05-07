import { Bodies, Composite, Engine } from 'matter-js'

// matter
export const engine = Engine.create()
engine.gravity.y = 9.85

export function composite(Body: Matter.Body): void
export function composite(Bodys: Matter.Body[]): void
export function composite(arg: Matter.Body | Matter.Body[]) {
  Composite.add(engine.world, arg)
}

export function genGround(x: number, y: number, width: number, height: number) {
  const ground = Bodies.rectangle(x, y, width, height, { isStatic: true })
  composite(ground)
}
