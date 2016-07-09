var http = require('http');

const PORT=3000;

var server = http.createServer(function(req, res) {
  req.end('it works!');
});

server.listen(PORT, function() {
  console.log('Server listening on: http://localhost:%s', PORT);
});
