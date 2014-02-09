// Generated by CoffeeScript 1.6.3
var WebSocketServer, connectionPool, http, originIsAllowed, server, wsServer;

WebSocketServer = require('websocket').server;

http = require('http');

server = http.createServer(function(request, response) {
  console.log('Received request for ' + request.url);
  response.writeHead(404);
  return response.end();
});

server.listen(8888, function() {
  return console.log('Server is listening on port 8888');
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

originIsAllowed = function(origin) {
  console.log("origin:", origin);
  return true;
};

connectionPool = [];

wsServer.on('request', function(request) {
  var connection;
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log('Connection from origin', request.origin, 'rejected.');
    return;
  }
  connection = request.accept('echo-protocol', request.origin);
  console.log('Connection accepted.');
  connectionPool.push(connection);
  connection.on('message', function(message) {
    var i;
    i = 0;
    while (i < connectionPool.length) {
      connectionPool[i].send(message.utf8Data);
      i++;
    }
    console.log(message.utf8Data);
    return console.log("connectionPool length:", connectionPool.length);
  });
  return connection.on('close', function(reasonCode, description) {
    return console.log('Peer', connection.remoteAddress, 'disconnected.');
  });
});

/*
//@ sourceMappingURL=index.map
*/
