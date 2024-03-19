class Tick {
  lastTickTime: number
  ticks: number
  tickLastTime: number
  tickFunc: (resolve: (value: unknown) => void, reject: (reason?: any)) => void

  constructor(cb: (resolve: (value: unknown) => void, reject: (reason?: any)) => void) {
    this.lastTickTime = performance.now()
    this.ticks = 30
    this.tickLastTime = 1000 / this.ticks
    this.tickFunc = cb
  }

  go() {
    this.lastTickTime = performance.now()
    requestAnimationFrame(() => {
      const nowTickTime = performance.now()
      if (nowTickTime - this.lastTickTime >= this.tickLastTime) {
        this.lastTickTime = nowTickTime
        new Promise((resolve, reject) => {
          this.tickFunc(resolve, reject)
        }).then(this.go)
      }
    })
  }
}

export default Tick
