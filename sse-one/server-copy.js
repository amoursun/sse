const express = require('express');
const cors = require('cors');

const app = express(); 
app.use(cors());

const headers = { 
    "Content-Type": "text/event-stream", 
    Connection: "keep-alive", 
    "Cache-Control": "no-cache", 
};
let count = 0;
let interval;
app.get('/sse', (req, res) => {
    res.writeHead(200, headers);
    interval = setInterval(() => {
        const data = `${JSON.stringify({ count })}\n\n`;
        res.write(data);
        count++;
    }, 1000);
    req.on('close', () => {
        clearInterval(interval);
    });
});
app.use(express.static('public'));
app.listen(4000, () => {
    console.log("listening...");
});