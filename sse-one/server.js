const express = require('express');
const cors = require('cors');
const SseServer = require('./sse-server');

const app = express(); 
app.use(cors());

const mySseServer = new SseServer(
    {
      maxConnections: 3, // 设置最大链接数量
    }
);

app.use('/sse', mySseServer.middleWare());
app.use(express.static('public'));
const port = 4001;
app.listen(port, () => {
  console.log(`App is listening to port http://localhost:${port}`);
});

// 模拟向客户端推送消息
setInterval(() => {
    // 当前链接的数量
    console.log('current connect number:', mySseServer.sseConnections.size);
    mySseServer.announce(`It is ${new Date()} now!`);
}, 2000);