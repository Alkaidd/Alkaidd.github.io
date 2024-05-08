export default function about_snake () {
return <div><h1>如何使用react徒手搓一个贪吃蛇游戏</h1>
<p>本篇文章聊聊自己在手搓贪吃蛇游戏的一些设计和思考。</p>
<h2>开始写代码前的思考和分析</h2>
<p>简单分析下贪吃蛇这个游戏的特点，贪吃蛇的元素比较简单--蛇和食物。下面从代码的抽象层面和绘制层面两个角度来讲讲。</p>
<h3>逻辑层代码抽象</h3>
<p>对于蛇的状态更新则有以下几种，移动/吃食物/撞墙/咬到自己。从逻辑上来说，前两种可以视为action，后两种则是状态检测。从代码层面来说，蛇只有移动这一种action，剩下三种都是状态检测，毕竟我们的游戏是贪吃蛇，蛇不会不吃食物。只有移动是用户可以控制的。<br />
如果这样考虑，那么食物的消失和生成也可以理解成蛇的状态更新的副作用，在蛇吃下食物后触发。</p>
<h3>绘制</h3>
<p>由于贪吃蛇网格状的屏幕，在不考虑细分蛇的部位的时候，每个格子只有三种状态，空格，蛇，食物。<br />
绘制层面上我们不需要关心逻辑层处于什么状态，我们只关心这一帧需要绘制什么。因此我用一个矩阵存储每一格的信息。在设计的开始我暂时不考虑复杂的设计，空格表示为0，蛇表示为1，食物表示为2。现在即使逻辑层没有任何代码，我们也可以利用这个数字矩阵绘制出贪吃蛇游戏了。尽管这条蛇还不能动。</p>
<h3>计时器</h3>
<p>刚刚我们提到了“帧”的概念。相信大家对于这个词并不陌生，不了解也没关系。上文提到了我们围绕蛇的移动构建整个游戏的逻辑层，也有了把蛇和食物绘制到屏幕上的idea，现在的问题是，什么时候让蛇移动？怎么样让逻辑上移动的蛇在屏幕上也移动？</p>
<p>这里我们就需要一个计时器，它的作用是每秒钟调用30次callback，这样我们就把1s分成了30帧，每一帧我们都去调用逻辑层的代码，去移动蛇，然后获取蛇的新位置，最后把蛇绘制到屏幕上，这样我们就实现了“让蛇动起来”的功能。</p>
<p>当然，严格来说不按照这个顺序执行也是没有问题的。在什么时机调用蛇的action来更新状态是可以有选择的。我们可以在绘制后调用一次移动，这样下一帧也可以绘制出新位置，也可以在绘制前调用，这样就会在这一帧绘制。这就好像组件的生命周期一样，beforeUpdate和afterUpdate都可以抛出hook，取决于我们的需求。当然我们这里的场景实际上也并不太需要关心时机，因为都是可以的。</p>
<p>好像有些离题了。回到计时器，相信大家都能想到使用requestAnimationFrame这个api，当然使用setIntervel甚至是setTimeOut在我们这种不是很精致的设计里也是可以的，不过还是推荐你使用raf以获取更精细的控制和更好的性能。当然在使用的时候我们还要做一点小小的封装。</p>
<h2>开始coding</h2>
<p>工欲善其事，必先利其器。计时器是可以脱离我们具体场景单独封装的工具库，所以我们先来实现一下我们的计时器。</p>
<h3>计时器</h3>
<p>没什么太多值得说的，一秒钟分成30帧，每一帧持续时间结束后递归调用。注意使用performance.now()以获取更精准的时间。</p>
<pre><code className="hljs language-typescript"><span className="hljs-keyword">{`class`}</span>{` `}<span className="hljs-title class_">{`Tick`}</span>{` {
  `}<span className="hljs-attr">{`lastTickTime`}</span>{`: `}<span className="hljs-built_in">{`number`}</span>{`
  `}<span className="hljs-attr">{`ticks`}</span>{`: `}<span className="hljs-built_in">{`number`}</span>{`
  `}<span className="hljs-attr">{`tickLastTime`}</span>{`: `}<span className="hljs-built_in">{`number`}</span>{`
  `}<span className="hljs-attr">{`stopFlag`}</span>{`: `}<span className="hljs-built_in">{`boolean`}</span>{`
  `}<span className="hljs-attr">{`tickFunc`}</span>{`: `}<span className="hljs-function">{`(`}<span className="hljs-params">{`
    lastTickTime: `}<span className="hljs-built_in">{`number`}</span>{`,
    nowTickTime: `}<span className="hljs-built_in">{`number`}</span>{`,
    resolve: (value: `}<span className="hljs-built_in">{`unknown`}</span>{`) => `}<span className="hljs-built_in">{`void`}</span>{`,
    reject: (reason?: `}<span className="hljs-built_in">{`any`}</span>{`) => `}<span className="hljs-built_in">{`void`}</span>{`,
  `}</span>{`) =>`}</span>{` `}<span className="hljs-built_in">{`void`}</span>{`

  `}<span className="hljs-title function_">{`constructor`}</span>{`(`}<span className="hljs-params">{`
    cb: (
      lastTickTime: `}<span className="hljs-built_in">{`number`}</span>{`,
      nowTickTime: `}<span className="hljs-built_in">{`number`}</span>{`,
      resolve: (value: `}<span className="hljs-built_in">{`unknown`}</span>{`) => `}<span className="hljs-built_in">{`void`}</span>{`,
      reject: (reason?: `}<span className="hljs-built_in">{`any`}</span>{`) => `}<span className="hljs-built_in">{`void`}</span>{`,
    ) => `}<span className="hljs-built_in">{`void`}</span>{`,
  `}</span>{`) {
    `}<span className="hljs-comment">{`// console.log('newed')`}</span>{`
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`lastTickTime`}</span>{` = performance.`}<span className="hljs-title function_">{`now`}</span>{`()
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`ticks`}</span>{` = `}<span className="hljs-number">{`30`}</span>{`
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`tickLastTime`}</span>{` = `}<span className="hljs-number">{`1000`}</span>{` / `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`ticks`}</span>{`
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`tickFunc`}</span>{` = cb
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`stopFlag`}</span>{` = `}<span className="hljs-literal">{`false`}</span>{`
  }

  `}<span className="hljs-title function_">{`go`}</span>{`(`}<span className="hljs-params"></span>{`) {
    `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`stopFlag`}</span>{`) {
      `}<span className="hljs-keyword">{`return`}</span>{`
    }

    `}<span className="hljs-title function_">{`requestAnimationFrame`}</span>{`(`}<span className="hljs-function">{`() =>`}</span>{` {
      `}<span className="hljs-keyword">{`const`}</span>{` nowTickTime = performance.`}<span className="hljs-title function_">{`now`}</span>{`()
      `}<span className="hljs-keyword">{`new`}</span>{` `}<span className="hljs-title class_">{`Promise`}</span>{`&#x3C;`}<span className="hljs-built_in">{`any`}</span>{`>(`}<span className="hljs-function">{`(`}<span className="hljs-params">{`resolve, reject`}</span>{`) =>`}</span>{` {
        `}<span className="hljs-keyword">{`if`}</span>{` (nowTickTime - `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`lastTickTime`}</span>{` >= `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`tickLastTime`}</span>{`) {
          `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-title function_">{`tickFunc`}</span>{`(`}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`lastTickTime`}</span>{`, nowTickTime, resolve, reject)
          `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`lastTickTime`}</span>{` = nowTickTime
          `}<span className="hljs-title function_">{`resolve`}</span>{`(`}<span className="hljs-string">{`'ticked'`}</span>{`)
          `}<span className="hljs-comment">{`// console.log('ticked')`}</span>{`
        } `}<span className="hljs-keyword">{`else`}</span>{` {
          `}<span className="hljs-title function_">{`resolve`}</span>{`(`}<span className="hljs-string">{`'no tick'`}</span>{`)
        }
      }).`}<span className="hljs-title function_">{`then`}</span>{`(`}<span className="hljs-function">{`() =>`}</span>{` {
        `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-title function_">{`go`}</span>{`()
      })
    })
  }

  `}<span className="hljs-title function_">{`stop`}</span>{`(`}<span className="hljs-params"></span>{`) {
    `}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(`}<span className="hljs-string">{`'stop'`}</span>{`)
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`stopFlag`}</span>{` = `}<span className="hljs-literal">{`true`}</span>{`
  }

  `}<span className="hljs-title function_">{`start`}</span>{`(`}<span className="hljs-params"></span>{`) {
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`stopFlag`}</span>{` = `}<span className="hljs-literal">{`false`}</span>{`
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`lastTickTime`}</span>{` = performance.`}<span className="hljs-title function_">{`now`}</span>{`()
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-title function_">{`go`}</span>{`()
  }
}

`}<span className="hljs-keyword">{`export`}</span>{` `}<span className="hljs-keyword">{`default`}</span>{` `}<span className="hljs-title class_">{`Tick`}</span>{`
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<h3>绘制层</h3>
<p>绘制层也比较简单，我们用一个嵌套列表将矩阵渲染成dom元素即可，这里使用react + unocss。</p>
<pre><code className="hljs language-typescript">{``}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<h3>逻辑层</h3>
<p>对于蛇来说我们需要知道它的位置，也需要一个坐标系。对于绘制来说，我们需要一个“屏幕”以供绘制。因此我们新构造一个x*y大小的矩阵。</p>
<pre><code className="hljs language-typescript"><span className="hljs-keyword">{`class`}</span>{` `}<span className="hljs-title class_">{`Snake`}</span>{` {
  `}<span className="hljs-comment">{`// 0: space`}</span>{`
  `}<span className="hljs-comment">{`// 1: snake`}</span>{`
  `}<span className="hljs-comment">{`// 2: food`}</span>{`
  `}<span className="hljs-attr">{`screen`}</span>{`: `}<span className="hljs-built_in">{`number`}</span>{`[][]

  `}<span className="hljs-title function_">{`constrcutor`}</span>{`(`}<span className="hljs-params">{`x: `}<span className="hljs-built_in">{`number`}</span>{`, y: `}<span className="hljs-built_in">{`number`}</span></span>{`) {
    `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`screen`}</span>{` = `}<span className="hljs-keyword">{`new`}</span>{` `}<span className="hljs-title class_">{`Array`}</span>{`(x).`}<span className="hljs-title function_">{`fill`}</span>{`(`}<span className="hljs-literal">{`null`}</span>{`).`}<span className="hljs-title function_">{`map`}</span>{`(`}<span className="hljs-function">{`() =>`}</span>{` `}<span className="hljs-keyword">{`new`}</span>{` `}<span className="hljs-title class_">{`Array`}</span>{`(y).`}<span className="hljs-title function_">{`fill`}</span>{`(`}<span className="hljs-number">{`0`}</span>{`))
  }
}
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre></div>}