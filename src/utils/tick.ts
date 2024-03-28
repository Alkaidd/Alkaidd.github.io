class Tick {
  lastTickTime: number
  ticks: number
  tickLastTime: number
  stopFlag: boolean
  tickFunc: (
    lastTickTime: number,
    nowTickTime: number,
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void,
  ) => void

  constructor(
    cb: (
      lastTickTime: number,
      nowTickTime: number,
      resolve: (value: unknown) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    this.lastTickTime = performance.now()
    this.ticks = 30
    this.tickLastTime = 1000 / this.ticks
    this.tickFunc = cb
    this.stopFlag = false
  }

  go() {
    if (this.stopFlag) {
      return
    }

    requestAnimationFrame(() => {
      const nowTickTime = performance.now()
      new Promise<any>((resolve, reject) => {
        if (nowTickTime - this.lastTickTime >= this.tickLastTime) {
          this.tickFunc(this.lastTickTime, nowTickTime, resolve, reject)
          this.lastTickTime = nowTickTime
          resolve('ticked')
          // console.log('ticked')
        } else {
          resolve('no tick')
        }
      }).then(() => {
        this.go()
      })
    })
  }

  stop() {
    console.log('stop')
    this.stopFlag = true
  }

  start() {
    this.stopFlag = false
    this.lastTickTime = performance.now()
    this.go()
  }
}

export default Tick
