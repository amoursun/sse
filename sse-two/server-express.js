var express = require('express')
var fs = require('fs')
var pub = require('./public');
var app = express()

app.get('/stream', function(req, res) {
    console.log(111)

    res.writeHead(200, {
        "Content-Type":"text/event-stream", 
        "Cache-Control":"no-cache", 
        "Connection":"keep-alive"
    });

    res.write("retry: 10000\n");
    res.write("event: connecttime\n");
    res.write("data: " + (new Date()) + "\n\n");
    res.write("data: " + (new Date()) + "\n\n");

    interval = setInterval(function() {
        res.write("data: " + (new Date()) + "\n\n");
    }, 1000);

    req.connection.addListener("close", function () {
        clearInterval(interval);
    }, false);
})

app.use(function(req, res) {
    fs.readFile(pub, 'utf8',function(err, html) {
        if (err) {
            console.log(err)
            return
        }
        res.send(html)
    })
})

app.listen(9998, function(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('listening on port 9998')
})