export default function web_cache () {
return <div><h1>从跨域到前端缓存到性能优化</h1>
<p>一次面试的时候从跨域问题聊到了前端缓存又聊到了性能优化，听上去前端缓存和性能优化还有挺大的关系，但是跨域和前端缓存又有什么关系呢？听我慢慢梳理</p>
<h2>跨域问题</h2>
<p>跨域问题算是前端工程师的入门课，但是当时确实太久没面试了，聊的不太好，这里简单梳理下。</p>
<h3>跨源资源共享（CORS）</h3>
<p>跨源资源共享（CORS，或通俗地译为跨域资源共享）是一种基于 HTTP 头的机制，该机制通过允许服务器标示除了它自己以外的其他源（域、协议或端口），使得浏览器允许这些源访问加载自己的资源。跨源资源共享还通过一种机制来检查服务器是否会允许要发送的真实请求，该机制通过浏览器发起一个到服务器托管的跨源资源的“预检”请求。在预检中，浏览器发送的头中标示有 HTTP 方法和真实请求中会用到的</p>
<h3>跨域跨的什么域</h3>
<p>其实这里的域也就是源，包含请求协议（http/https）、主机名、端口。</p>
<h3>哪些资源会引发跨域请求</h3>
<p>根据<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS">mdn</a>上的说明，会引发跨域的情况主要有以下几种：</p>
<ol>
<li>由 XMLHttpRequest 或 Fetch API 发起的跨源 HTTP 请求。</li>
<li>Web 字体（CSS 中通过 @font-face 使用跨源字体资源）。</li>
<li>WebGl贴图。</li>
<li>既然WebGl不行，那么WebGPU和canvas自然也是不行的，</li>
<li>css属性引入的图片，如url('...link')</li>
</ol>
<h3>跨域标头字段</h3>
<p>跨源资源共享规范定义了一组特殊的请求头和响应头。</p>
<h4>请求头</h4>
<ol>
<li>Origin 标头字段表明预检请求或实际跨源请求的源站。</li>
<li>Access-Control-Request-Method 标头字段用于预检请求。其作用是，将实际请求所使用的 HTTP 方法告诉服务器。</li>
<li>Access-Control-Request-Headers 标头字段用于预检请求。其作用是，将实际请求所携带的标头字段（通过 setRequestHeader() 等设置的）告诉服务器。这个浏览器端标头将由互补的服务器端标头 Access-Control-Allow-Headers 回答。</li>
</ol>
<h4>响应头</h4>
<ol>
<li>响应标头中可以携带一个 Access-Control-Allow-Origin字段用于指明允许跨域请求的域名，或者使用通配符。不过目前最新版的chrome在http中使用通配符貌似会受到限制。</li>
<li>Access-Control-Expose-Headers，在跨源访问时，XMLHttpRequest 对象的 getResponseHeader() 方法只能拿到一些最基本的响应头，Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma，如果要访问其他头，则需要服务器设置本响应头。<br />
Access-Control-Expose-Headers 头将指定标头放入允许列表中，供浏览器的 JavaScript 代码（如 getResponseHeader()）获取。</li>
<li>Access-Control-Max-Age头指定了预请求的结果能够被缓存多久。</li>
<li>Access-Control-Allow-Credentials 头指定了当浏览器的 credentials 设置为 true 时是否允许浏览器读取 response 的内容。当用在对 preflight 预检测请求的响应中时，它指定了实际的请求是否可以使用 credentials。请注意：简单 GET 请求不会被预检；如果对此类请求的响应中不包含该字段，这个响应将被忽略掉，并且浏览器也不会将相应内容返回给网页。</li>
<li>Access-Control-Allow-Methods 标头字段指定了访问资源时允许使用的请求方法，用于预检请求的响应。其指明了实际请求所允许使用的 HTTP 方法。</li>
<li>Access-Control-Allow-Headers 标头字段用于预检请求的响应。其指明了实际请求中允许携带的标头字段。这个标头是服务器端对浏览器端 Access-Control-Request-Headers 标头的响应。</li>
</ol>
<h3>预请求</h3>
<p>上一小节里提到了预请求，我们就来聊聊到底什么是预请求。
在请求的资源不同域的情况下，浏览器会发起一个到服务器托管的跨源资源的“预检”请求，再控制台可以看到请求方式为options请求。</p>
<h4>简单请求</h4>
<p>某些请求不会触发 CORS 预检请求。在废弃的 CORS 规范中称这样的请求为简单请求，但是目前的 Fetch 规范（CORS 的现行定义规范）中不再使用这个词语。</p>
<p>其动机是，HTML 4.0 中的 form 元素（早于跨站 XMLHttpRequest 和 fetch）可以向任何来源提交简单请求，所以任何编写服务器的人一定已经在保护跨站请求伪造攻击（CSRF）。在这个假设下，服务器不必选择加入（通过响应预检请求）来接收任何看起来像表单提交的请求，因为 CSRF 的威胁并不比表单提交的威胁差。然而，服务器仍然必须提供 Access-Control-Allow-Origin 的选择，以便与脚本共享响应。</p>
<p>若请求满足所有下述条件，则该请求可视为简单请求：</p>
<ol>
<li>使用下列方法之一：<br />
GET<br />
HEAD<br />
POST</li>
<li>除了被用户代理自动设置的标头字段（例如 Connection、User-Agent 或其他在 Fetch 规范中定义为禁用标头名称的标头），允许人为设置的字段为 Fetch 规范定义的对 CORS 安全的标头字段集合。该集合为：<br />
Accept
Accept-Language<br />
Content-Language<br />
Content-Type（需要注意额外的限制）<br />
Range（只允许简单的范围标头值 如 bytes=256- 或 bytes=127-255）<br />
Content-Type 标头所指定的媒体类型的值仅限于下列三者之一：<br />
text/plain<br />
multipart/form-data<br />
application/x-www-form-urlencoded<br />
如果请求是使用 XMLHttpRequest 对象发出的，在返回的 XMLHttpRequest.upload 对象属性上没有注册任何事件监听器；也就是说，给定一个 XMLHttpRequest 实例 xhr，没有调用 xhr.upload.addEventListener()，以监听该上传请求。</li>
<li>请求中没有使用 ReadableStream 对象。</li>
</ol>
<h2>缓存</h2>
<p>注意到前面有一小节我们提到了一个标头字端，Access-Control-Max-Age。这个字段会缓存跨域请求预请求的结果，以便多次预请求的情况下节约资源，这里就联系到了前端缓存这件事儿上。</p>
<h3>http缓存</h3>
<p>to be continued...</p></div>}