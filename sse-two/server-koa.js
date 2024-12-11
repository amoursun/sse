var Koa = require('koa')
var fs = require('fs')
var pub = require('./public');
var PassThrough = require('stream').PassThrough

var app = new Koa()

app.use(function *() {
    var url = this.req.url
    if (url === '/stream') {
        var stream = new PassThrough()

        setInterval(function() {
            stream.write("data: " + (new Date()) + "\n\n")
        }, 1000);

        this.type = 'text/event-stream'
        this.body = stream
    } else {
        var html = yield koaFs
        this.body = html
    }
})

app.listen(9997, function(err) {
    if (err) {
        console.log(err)
        return 
    }
    console.log('listening on port 9997')
})

function koaFs(fn) {
    fs.readFile(pub, 'utf8', function(err, html) {
        fn(err, html)
    })
}