const http = require('http');

http
  .createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Docker Demo 01</h1>');
  })
  .listen(3000);

console.log('HTTP server is listening at port 3000.');
