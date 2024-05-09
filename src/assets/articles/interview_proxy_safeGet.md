# proxy面试题实战，真别说自己懂Vue3了

属实被面试官拷打了一番，面试官问我平时写项目主要用vue，看过vue源码吗？我自信满满的说看过，然后一顿巴拉巴拉，结果到了手撕代码的时候，面试官：看你说到了proxy，来道相关面试题吧。

## 题干

```javascript
function safeGet(obj) {
    // complete the code here
}

const testObj = {
  a: "a",
  b: 1,
  c: {
    d: "123",
  },
  e: [1, 2, 3],
}
const safeGetRes = safeGet(testObj)

// test
console.log(safeGetRes.a() === testObj.a);
console.log(safeGetRes.c.d() === testObj.c.d);
console.log(safeGetRes.c.e() === void 0);
console.log(safeGetRes.c.e("hello") === "hello");
console.log(
  safeGetRes.e
    .map((e: () => any) => e())
    .every((e: any, index: number) => testObj.e[index] === e)
);
console.log(safeGetRes.e[0]() === testObj.e[0]);
console.log(safeGetRes.e[100]() === void 0);
console.log(safeGetRes.e[100](123) === 123);
console.log(safeGetRes.j.k.l() === void 0);
```

看到题直接差点晕死过去，不是，我说我知道vue3是通过proxy实现的响应式，你还真不客气啊...

## 解题

咱们一个一个测试用例来看吧

### 用例分析1

```javascript
console.log(safeGetRes.a() === testObj.a)
console.log(safeGetRes.c.d() === testObj.c.d)
console.log(safeGetRes.c.e() === void 0)
```

对于目标对象中已有的属性，如果它的值是个简单类型，我们直接返回一个function，调用后返回它的值，如果这个属性不存在，则这个function返回undefined。  
如果是个复杂类型，我们还要继续递归。

```javascript
function safeGet(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      if (Reflect.has(target, prop)) {
        const temp = Reflect.get(target, prop)

        if (typeof temp === 'number' || typeof temp === 'string') {
          return () => temp
        }

        if (typeof temp === 'object') {
          return safeGet(temp)
        }

        return () => temp
      }
      return () => undefined
    },
  })
}
```

#### proxyHandler

proxy的handler里有get和set两个方法，和一个普通的对象一样，可以通过getter获取到属性的值。get和set有三个入参，分别是target, prop和receiver。  
前面两个好理解，对于形如a.b的调用，a是target，b是prop。比较难理解的事receiver是什么？从字面意思来看是接受者，谁是接收者？让我们来看个示例。

```javascript
const obj = {
  get a() {
    return this.b
  },
}

console.log(Reflect.get(obj, 'a')) // undefined
console.log(Reflect.get(obj, 'a', { b: 1 })) // 1
```

关于Reflect系列api可以参考[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)，这里不再赘述，可以理解成比较现代的对象操作方法，在vue3的源码里我们可以看到被大量使用在proxy里。  
可以看到在这里receiver相当于提供了一个this指针供Reflect使用。实际上在proxy里使用Reflect的主要原因就是避免this指针指向问题，有空的话可以单独写一篇文章讲讲这个问题。  
总之在这道题里我们没有this指针指向的问题，可以不用过多考虑。

#### 惰性计算

和迭代器以及generator一样，proxy的getter是惰性计算的，因此我们不必担心递归safeGet的时候没有break条件导致栈溢出。

### 用例分析2

我们继续看用例。

```javascript
console.log(safeGetRes.c.e('hello') === 'hello')
```

在对于属性不存在的情况我们需要把传进来的值直接返回出去，简单修改下最后返回的方法

```javascript
// old
() => undefined

// new
(val) => val
```

### 用例分析3

```javascript
console.log(
  safeGetRes.e
    .map((e: () => any) => e())
    .every((e: any, index: number) => testObj.e[index] === e)
);
console.log(safeGetRes.e[0]() === testObj.e[0]);
console.log(safeGetRes.e[100]() === void 0);
console.log(safeGetRes.e[100](123) === 123);
```

对于数组上的方法我们需要正确返回，但是迭代器访问的数组元素和之前对象中的属性一样被转变为一个function，我们新增一下堆数组类型的判断

```javascript
// ...
    get(target, prop) {
      if (Array.isArray(target)) {
        if (Reflect.has(target, prop)) {
          if (typeof prop === "string" && !isNaN(parseInt(prop))) {
            return () => Reflect.get(target, prop);
          }
          return Reflect.get(target, prop);
        }
        return (val: any) => val;
      }

      if (Reflect.has(target, prop)) {
// ...
```

我们对传进来的prop进行一个判断，如果能被解析为整数，我们就认为是在访问数组索引，不能访问我们就认为在访问数组的属性和原型链上的方法，值得注意的是，map方法会先访问一次数组的length属性，这也是会被proxy拦截的。

### 用例分析4

```javascript
console.log(safeGetRes.j.k.l() === void 0)
```

对于代理目标上不存在的属性，我们可以一直链式调用，而不会产生target undefined的报错。最后再调用safeGet包装下返回的方法即可

```javascript
// old
return () => undefined

// new
return safeGet((val) => val)
```

## 完整代码

完整代码如下：

```javascript
// safeGet
function safeGet(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      if (Array.isArray(target)) {
        if (Reflect.has(target, prop)) {
          if (typeof prop === 'string' && !isNaN(parseInt(prop))) {
            return () => Reflect.get(target, prop)
          }
          return Reflect.get(target, prop)
        }
        return (val) => val
      }

      if (Reflect.has(target, prop)) {
        const temp = Reflect.get(target, prop)

        if (typeof temp === 'number' || typeof temp === 'string') {
          return () => temp
        }

        if (typeof temp === 'object') {
          return safeGet(temp)
        }

        return () => temp
      }

      return safeGet((val) => val)
    },
  })
}
```

## btw

面试寄完了，当时就想到要用proxy。
