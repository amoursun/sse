var http = require("http")
var fs = require('fs')
var pub = require('./public');

http.createServer(function (req, res) {

    var fileName = "." + req.url;

    if (fileName === "./stream") {
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
  } else {
      fs.readFile(pub, 'utf8',function(err, html) {
          if (err) {
              console.log(err)
              return
          }
          res.end(html)
      })

  }
}).listen(9999, function(err) {
    if (err) {
        console.log(err)
        return 
    }
    console.log('listening on port 9999')
});