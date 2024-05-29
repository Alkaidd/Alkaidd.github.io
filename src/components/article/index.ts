import { default as about_snake } from './about_snake.tsx'
import { default as feeling_20240520 } from './feeling_20240520.tsx'
import { default as first_article } from './first_article.tsx'
import { default as interview_proxy_safeGet } from './interview_proxy_safeGet.tsx'

export const fileInfoList = [ 
{
  name: 'about_snake',
  title: '如何使用react徒手搓一个贪吃蛇游戏',
  abstract: '本篇文章聊聊自己在手搓贪吃蛇游戏的一些设计和思考。',
  birthTime: '2024-05-08',
  fileSize: 5221
},
{
  name: 'feeling_20240520',
  title: '花有重开日，人无再少时',
  abstract: '按照我老家的算法我现在应该是25岁，按照实岁来算的话马上也24岁了。我对自己的印象总是停留在自己对母亲笑着说，我还未满18岁，不能去打工的那一幕。',
  birthTime: '',
  fileSize: 2325
},
{
  name: 'first_article',
  title: '我的第一篇文章[此处是标题]',
  abstract: '这里应该是文章的简介和关键词。',
  birthTime: '2024-04-24',
  fileSize: 185
},
{
  name: 'interview_proxy_safeGet',
  title: 'proxy面试题实战，真别说自己懂Vue3了',
  abstract: '属实被面试官拷打了一番，面试官问我平时写项目主要用vue，看过vue源码吗？我自信满满的说看过，然后一顿巴拉巴拉，结果到了手撕代码的时候，面试官：看你说到了proxy，来道相关面试题吧。',
  birthTime: '2024-05-09',
  fileSize: 6094
}
]

export default { about_snake, feeling_20240520, first_article, interview_proxy_safeGet }
