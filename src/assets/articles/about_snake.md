# 如何使用react徒手搓一个贪吃蛇游戏

本篇文章聊聊自己在手搓贪吃蛇游戏的一些设计和思考。

## 开始写代码前的思考和分析

简单分析下贪吃蛇这个游戏的特点，贪吃蛇的元素比较简单--蛇和食物。下面从代码的抽象层面和绘制层面两个角度来讲讲。

### 逻辑层代码抽象

对于蛇的状态更新则有以下几种，移动/吃食物/撞墙/咬到自己。从逻辑上来说，前两种可以视为action，后两种则是状态检测。从代码层面来说，蛇只有移动这一种action，剩下三种都是状态检测，毕竟我们的游戏是贪吃蛇，蛇不会不吃食物。只有移动是用户可以控制的。  
如果这样考虑，那么食物的消失和生成也可以理解成蛇的状态更新的副作用，在蛇吃下食物后触发。

### 绘制

由于贪吃蛇网格状的屏幕，在不考虑细分蛇的部位的时候，每个格子只有三种状态，空格，蛇，食物。  
绘制层面上我们不需要关心逻辑层处于什么状态，我们只关心这一帧需要绘制什么。因此我用一个矩阵存储每一格的信息。在设计的开始我暂时不考虑复杂的设计，空格表示为0，蛇表示为1，食物表示为2。现在即使逻辑层没有任何代码，我们也可以利用这个数字矩阵绘制出贪吃蛇游戏了。尽管这条蛇还不能动。

### 计时器

刚刚我们提到了“帧”的概念。相信大家对于这个词并不陌生，不了解也没关系。上文提到了我们围绕蛇的移动构建整个游戏的逻辑层，也有了把蛇和食物绘制到屏幕上的idea，现在的问题是，什么时候让蛇移动？怎么样让逻辑上移动的蛇在屏幕上也移动？

这里我们就需要一个计时器，它的作用是每秒钟调用30次callback，这样我们就把1s分成了30帧，每一帧我们都去调用逻辑层的代码，去移动蛇，然后获取蛇的新位置，最后把蛇绘制到屏幕上，这样我们就实现了“让蛇动起来”的功能。

当然，严格来说不按照这个顺序执行也是没有问题的。在什么时机调用蛇的action来更新状态是可以有选择的。我们可以在绘制后调用一次移动，这样下一帧也可以绘制出新位置，也可以在绘制前调用，这样就会在这一帧绘制。这就好像组件的生命周期一样，beforeUpdate和afterUpdate都可以抛出hook，取决于我们的需求。当然我们这里的场景实际上也并不太需要关心时机，因为都是可以的。

好像有些离题了。回到计时器，相信大家都能想到使用requestAnimationFrame这个api，当然使用setIntervel甚至是setTimeOut在我们这种不是很精致的设计里也是可以的，不过还是推荐你使用raf以获取更精细的控制和更好的性能。当然在使用的时候我们还要做一点小小的封装。

## 开始coding

工欲善其事，必先利其器。计时器是可以脱离我们具体场景单独封装的工具库，所以我们先来实现一下我们的计时器。

### 计时器

没什么太多值得说的，一秒钟分成30帧，每一帧持续时间结束后递归调用。注意使用performance.now()以获取更精准的时间。

```typescript
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
    // console.log('newed')
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
```

### 绘制层

绘制层也比较简单，我们用一个嵌套列表将矩阵渲染成dom元素即可，这里使用react + unocss。

```typescript

```

### 逻辑层

对于蛇来说我们需要知道它的位置，也需要一个坐标系。对于绘制来说，我们需要一个“屏幕”以供绘制。因此我们新构造一个x\*y大小的矩阵。

```typescript
class Snake {
  // 0: space
  // 1: snake
  // 2: food
  screen: number[][]

  constrcutor(x: number, y: number) {
    this.screen = new Array(x).fill(null).map(() => new Array(y).fill(0))
  }
}
```
