const SseStream = require('ssestream');
// 提供下面
// pipe(destination, options) {
//     if (typeof destination.writeHead === 'function') {
//       destination.writeHead(200, {
//         'Content-Type': 'text/event-stream; charset=utf-8',
//         'Transfer-Encoding': 'identity',
//         'Cache-Control': 'no-cache',
//         Connection: 'keep-alive',
//       })
//       destination.flushHeaders()
//     }
//     // Some clients (Safari) don't trigger onopen until the first frame is received.
//     destination.write(':ok\n\n')
//     return super.pipe(destination, options)
//   }
module.exports = class SseServer {
  constructor (options) {
    // 用来缓存当前所有的链接用来之后发送消息
    this.sseConnections = new Set()
    // 设置最大链接数
    this.maxConnections = options.maxConnections || Infinity;
    this.middleWare = this.middleWare.bind(this);
    this.announce = this.announce.bind(this);
  }
  middleWare () {
    return (req, res) => {
      const sseConnections =  this.sseConnections;
      // 超过最大链接数的时候需要拒绝客户端请求
      if (sseConnections.size >= this.maxConnections) {
        return res.status(429).send()
      }
      const sse = new SseStream(req);
      // 详见 ssestream 的 api
      sse.pipe(res);
      const metaData = [sse, req, res];
      // 写入链接缓存
      sseConnections.add(metaData)
      // 与客户端链接断开时需要清除链接缓存
      req.on('close', function () {
        console.log('CONNECTION CLOSED!!!')
        sseConnections.delete(metaData)
      })
    }
  }
  // 向客户端广播消息
  announce(data) {
    this.sseConnections.forEach((meta) => {
      const [sse, req, res] = meta
      const message = {
        data,
      };
      meta[0].write(message);
    })
  }
}