export default function interview_proxy_safeGet () {
return <div><h1>proxy面试题实战，真别说自己懂Vue3了</h1>
<p>属实被面试官拷打了一番，面试官问我平时写项目主要用vue，看过vue源码吗？我自信满满的说看过，然后一顿巴拉巴拉，结果到了手撕代码的时候，面试官：看你说到了proxy，来道相关面试题吧。</p>
<h2>题干</h2>
<pre><code className="hljs language-javascript"><span className="hljs-keyword">{`function`}</span>{` `}<span className="hljs-title function_">{`safeGet`}</span>{`(`}<span className="hljs-params">{`obj`}</span>{`) {
    `}<span className="hljs-comment">{`// complete the code here`}</span>{`
}

`}<span className="hljs-keyword">{`const`}</span>{` testObj = {
  `}<span className="hljs-attr">{`a`}</span>{`: `}<span className="hljs-string">{`"a"`}</span>{`,
  `}<span className="hljs-attr">{`b`}</span>{`: `}<span className="hljs-number">{`1`}</span>{`,
  `}<span className="hljs-attr">{`c`}</span>{`: {
    `}<span className="hljs-attr">{`d`}</span>{`: `}<span className="hljs-string">{`"123"`}</span>{`,
  },
  `}<span className="hljs-attr">{`e`}</span>{`: [`}<span className="hljs-number">{`1`}</span>{`, `}<span className="hljs-number">{`2`}</span>{`, `}<span className="hljs-number">{`3`}</span>{`],
}
`}<span className="hljs-keyword">{`const`}</span>{` safeGetRes = `}<span className="hljs-title function_">{`safeGet`}</span>{`(testObj)

`}<span className="hljs-comment">{`// test`}</span>{`
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-title function_">{`a`}</span>{`() === testObj.`}<span className="hljs-property">{`a`}</span>{`);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`c`}</span>{`.`}<span className="hljs-title function_">{`d`}</span>{`() === testObj.`}<span className="hljs-property">{`c`}</span>{`.`}<span className="hljs-property">{`d`}</span>{`);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`c`}</span>{`.`}<span className="hljs-title function_">{`e`}</span>{`() === `}<span className="hljs-keyword">{`void`}</span>{` `}<span className="hljs-number">{`0`}</span>{`);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`c`}</span>{`.`}<span className="hljs-title function_">{`e`}</span>{`(`}<span className="hljs-string">{`"hello"`}</span>{`) === `}<span className="hljs-string">{`"hello"`}</span>{`);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(
  safeGetRes.`}<span className="hljs-property">{`e`}</span>{`
    .`}<span className="hljs-title function_">{`map`}</span>{`(`}<span className="hljs-function">{`(`}<span className="hljs-params">{`e: () => any`}</span>{`) =>`}</span>{` `}<span className="hljs-title function_">{`e`}</span>{`())
    .`}<span className="hljs-title function_">{`every`}</span>{`(`}<span className="hljs-function">{`(`}<span className="hljs-params">{`e: any, index: number`}</span>{`) =>`}</span>{` testObj.`}<span className="hljs-property">{`e`}</span>{`[index] === e)
);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`e`}</span>{`[`}<span className="hljs-number">{`0`}</span>{`]() === testObj.`}<span className="hljs-property">{`e`}</span>{`[`}<span className="hljs-number">{`0`}</span>{`]);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`e`}</span>{`[`}<span className="hljs-number">{`100`}</span>{`]() === `}<span className="hljs-keyword">{`void`}</span>{` `}<span className="hljs-number">{`0`}</span>{`);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`e`}</span>{`[`}<span className="hljs-number">{`100`}</span>{`](`}<span className="hljs-number">{`123`}</span>{`) === `}<span className="hljs-number">{`123`}</span>{`);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`j`}</span>{`.`}<span className="hljs-property">{`k`}</span>{`.`}<span className="hljs-title function_">{`l`}</span>{`() === `}<span className="hljs-keyword">{`void`}</span>{` `}<span className="hljs-number">{`0`}</span>{`);
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<p>看到题直接差点晕死过去，不是，我说我知道vue3是通过proxy实现的响应式，你还真不客气啊...</p>
<h2>解题</h2>
<p>咱们一个一个测试用例来看吧</p>
<h3>用例分析1</h3>
<pre><code className="hljs language-javascript"><span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-title function_">{`a`}</span>{`() === testObj.`}<span className="hljs-property">{`a`}</span>{`)
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`c`}</span>{`.`}<span className="hljs-title function_">{`d`}</span>{`() === testObj.`}<span className="hljs-property">{`c`}</span>{`.`}<span className="hljs-property">{`d`}</span>{`)
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`c`}</span>{`.`}<span className="hljs-title function_">{`e`}</span>{`() === `}<span className="hljs-keyword">{`void`}</span>{` `}<span className="hljs-number">{`0`}</span>{`)
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<p>对于目标对象中已有的属性，如果它的值是个简单类型，我们直接返回一个function，调用后返回它的值，如果这个属性不存在，则这个function返回undefined。<br />
如果是个复杂类型，我们还要继续递归。</p>
<pre><code className="hljs language-javascript"><span className="hljs-keyword">{`function`}</span>{` `}<span className="hljs-title function_">{`safeGet`}</span>{`(`}<span className="hljs-params">{`obj`}</span>{`) {
  `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-keyword">{`new`}</span>{` `}<span className="hljs-title class_">{`Proxy`}</span>{`(obj, {
    `}<span className="hljs-title function_">{`get`}</span>{`(`}<span className="hljs-params">{`target, prop`}</span>{`) {
      `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`has`}</span>{`(target, prop)) {
        `}<span className="hljs-keyword">{`const`}</span>{` temp = `}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`get`}</span>{`(target, prop)

        `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-keyword">{`typeof`}</span>{` temp === `}<span className="hljs-string">{`'number'`}</span>{` || `}<span className="hljs-keyword">{`typeof`}</span>{` temp === `}<span className="hljs-string">{`'string'`}</span>{`) {
          `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`() =>`}</span>{` temp
        }

        `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-keyword">{`typeof`}</span>{` temp === `}<span className="hljs-string">{`'object'`}</span>{`) {
          `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-title function_">{`safeGet`}</span>{`(temp)
        }

        `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`() =>`}</span>{` temp
      }
      `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`() =>`}</span>{` `}<span className="hljs-literal">{`undefined`}</span>{`
    },
  })
}
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<h4>proxyHandler</h4>
<p>proxy的handler里有get和set两个方法，和一个普通的对象一样，可以通过getter获取到属性的值。get和set有三个入参，分别是target, prop和receiver。<br />
前面两个好理解，对于形如a.b的调用，a是target，b是prop。比较难理解的事receiver是什么？从字面意思来看是接受者，谁是接收者？让我们来看个示例。</p>
<pre><code className="hljs language-javascript"><span className="hljs-keyword">{`const`}</span>{` obj = {
  `}<span className="hljs-keyword">{`get`}</span>{` `}<span className="hljs-title function_">{`a`}</span>{`() {
    `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-variable language_">{`this`}</span>{`.`}<span className="hljs-property">{`b`}</span>{`
  },
}

`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(`}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`get`}</span>{`(obj, `}<span className="hljs-string">{`'a'`}</span>{`)) `}<span className="hljs-comment">{`// undefined`}</span>{`
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(`}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`get`}</span>{`(obj, `}<span className="hljs-string">{`'a'`}</span>{`, { `}<span className="hljs-attr">{`b`}</span>{`: `}<span className="hljs-number">{`1`}</span>{` })) `}<span className="hljs-comment">{`// 1`}</span>{`
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<p>关于Reflect系列api可以参考<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect">mdn</a>，这里不再赘述，可以理解成比较现代的对象操作方法，在vue3的源码里我们可以看到被大量使用在proxy里。<br />
可以看到在这里receiver相当于提供了一个this指针供Reflect使用。实际上在proxy里使用Reflect的主要原因就是避免this指针指向问题，有空的话可以单独写一篇文章讲讲这个问题。<br />
总之在这道题里我们没有this指针指向的问题，可以不用过多考虑。</p>
<h4>惰性计算</h4>
<p>和迭代器以及generator一样，proxy的getter是惰性计算的，因此我们不必担心递归safeGet的时候没有break条件导致栈溢出。</p>
<h3>用例分析2</h3>
<p>我们继续看用例。</p>
<pre><code className="hljs language-javascript"><span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`c`}</span>{`.`}<span className="hljs-title function_">{`e`}</span>{`(`}<span className="hljs-string">{`'hello'`}</span>{`) === `}<span className="hljs-string">{`'hello'`}</span>{`)
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<p>在对于属性不存在的情况我们需要把传进来的值直接返回出去，简单修改下最后返回的方法</p>
<pre><code className="hljs language-javascript"><span className="hljs-comment">{`// old`}</span>{`
() => `}<span className="hljs-literal">{`undefined`}</span>{`

`}<span className="hljs-comment">{`// new`}</span>{`
(val) => val
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<h3>用例分析3</h3>
<pre><code className="hljs language-javascript"><span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(
  safeGetRes.`}<span className="hljs-property">{`e`}</span>{`
    .`}<span className="hljs-title function_">{`map`}</span>{`(`}<span className="hljs-function">{`(`}<span className="hljs-params">{`e: () => any`}</span>{`) =>`}</span>{` `}<span className="hljs-title function_">{`e`}</span>{`())
    .`}<span className="hljs-title function_">{`every`}</span>{`(`}<span className="hljs-function">{`(`}<span className="hljs-params">{`e: any, index: number`}</span>{`) =>`}</span>{` testObj.`}<span className="hljs-property">{`e`}</span>{`[index] === e)
);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`e`}</span>{`[`}<span className="hljs-number">{`0`}</span>{`]() === testObj.`}<span className="hljs-property">{`e`}</span>{`[`}<span className="hljs-number">{`0`}</span>{`]);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`e`}</span>{`[`}<span className="hljs-number">{`100`}</span>{`]() === `}<span className="hljs-keyword">{`void`}</span>{` `}<span className="hljs-number">{`0`}</span>{`);
`}<span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`e`}</span>{`[`}<span className="hljs-number">{`100`}</span>{`](`}<span className="hljs-number">{`123`}</span>{`) === `}<span className="hljs-number">{`123`}</span>{`);
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<p>对于数组上的方法我们需要正确返回，但是迭代器访问的数组元素和之前对象中的属性一样被转变为一个function，我们新增一下堆数组类型的判断</p>
<pre><code className="hljs language-javascript"><span className="hljs-comment">{`// ...`}</span>{`
    `}<span className="hljs-title function_">{`get`}</span>{`(`}<span className="hljs-params">{`target, prop`}</span>{`) {
      `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-title class_">{`Array`}</span>{`.`}<span className="hljs-title function_">{`isArray`}</span>{`(target)) {
        `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`has`}</span>{`(target, prop)) {
          `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-keyword">{`typeof`}</span>{` prop === `}<span className="hljs-string">{`"string"`}</span>{` &#x26;&#x26; !`}<span className="hljs-built_in">{`isNaN`}</span>{`(`}<span className="hljs-built_in">{`parseInt`}</span>{`(prop))) {
            `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`() =>`}</span>{` `}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`get`}</span>{`(target, prop);
          }
          `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`get`}</span>{`(target, prop);
        }
        `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`(`}<span className="hljs-params">{`val: any`}</span>{`) =>`}</span>{` val;
      }

      `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`has`}</span>{`(target, prop)) {
`}<span className="hljs-comment">{`// ...`}</span>{`
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<p>我们对传进来的prop进行一个判断，如果能被解析为整数，我们就认为是在访问数组索引，不能访问我们就认为在访问数组的属性和原型链上的方法，值得注意的是，map方法会先访问一次数组的length属性，这也是会被proxy拦截的。</p>
<h3>用例分析4</h3>
<pre><code className="hljs language-javascript"><span className="hljs-variable language_">{`console`}</span>{`.`}<span className="hljs-title function_">{`log`}</span>{`(safeGetRes.`}<span className="hljs-property">{`j`}</span>{`.`}<span className="hljs-property">{`k`}</span>{`.`}<span className="hljs-title function_">{`l`}</span>{`() === `}<span className="hljs-keyword">{`void`}</span>{` `}<span className="hljs-number">{`0`}</span>{`)
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<p>对于代理目标上不存在的属性，我们可以一直链式调用，而不会产生target undefined的报错。最后再调用safeGet包装下返回的方法即可</p>
<pre><code className="hljs language-javascript"><span className="hljs-comment">{`// old`}</span>{`
`}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`() =>`}</span>{` `}<span className="hljs-literal">{`undefined`}</span>{`

`}<span className="hljs-comment">{`// new`}</span>{`
`}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-title function_">{`safeGet`}</span>{`(`}<span className="hljs-function">{`(`}<span className="hljs-params">{`val`}</span>{`) =>`}</span>{` val)
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<h2>完整代码</h2>
<p>完整代码如下：</p>
<pre><code className="hljs language-javascript"><span className="hljs-comment">{`// safeGet`}</span>{`
`}<span className="hljs-keyword">{`function`}</span>{` `}<span className="hljs-title function_">{`safeGet`}</span>{`(`}<span className="hljs-params">{`obj`}</span>{`) {
  `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-keyword">{`new`}</span>{` `}<span className="hljs-title class_">{`Proxy`}</span>{`(obj, {
    `}<span className="hljs-title function_">{`get`}</span>{`(`}<span className="hljs-params">{`target, prop`}</span>{`) {
      `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-title class_">{`Array`}</span>{`.`}<span className="hljs-title function_">{`isArray`}</span>{`(target)) {
        `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`has`}</span>{`(target, prop)) {
          `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-keyword">{`typeof`}</span>{` prop === `}<span className="hljs-string">{`'string'`}</span>{` &#x26;&#x26; !`}<span className="hljs-built_in">{`isNaN`}</span>{`(`}<span className="hljs-built_in">{`parseInt`}</span>{`(prop))) {
            `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`() =>`}</span>{` `}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`get`}</span>{`(target, prop)
          }
          `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`get`}</span>{`(target, prop)
        }
        `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`(`}<span className="hljs-params">{`val`}</span>{`) =>`}</span>{` val
      }

      `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`has`}</span>{`(target, prop)) {
        `}<span className="hljs-keyword">{`const`}</span>{` temp = `}<span className="hljs-title class_">{`Reflect`}</span>{`.`}<span className="hljs-title function_">{`get`}</span>{`(target, prop)

        `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-keyword">{`typeof`}</span>{` temp === `}<span className="hljs-string">{`'number'`}</span>{` || `}<span className="hljs-keyword">{`typeof`}</span>{` temp === `}<span className="hljs-string">{`'string'`}</span>{`) {
          `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`() =>`}</span>{` temp
        }

        `}<span className="hljs-keyword">{`if`}</span>{` (`}<span className="hljs-keyword">{`typeof`}</span>{` temp === `}<span className="hljs-string">{`'object'`}</span>{`) {
          `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-title function_">{`safeGet`}</span>{`(temp)
        }

        `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-function">{`() =>`}</span>{` temp
      }

      `}<span className="hljs-keyword">{`return`}</span>{` `}<span className="hljs-title function_">{`safeGet`}</span>{`(`}<span className="hljs-function">{`(`}<span className="hljs-params">{`val`}</span>{`) =>`}</span>{` val)
    },
  })
}
`}</code><div className="code-buttons"><button className="copy-button" title="copy">copy</button></div></pre>
<h2>btw</h2>
<p>面试寄完了，当时就想到要用proxy。</p></div>}