WebSocketServer = require('websocket').server
http = require('http')

server = http.createServer (request, response) ->
  console.log 'Received request for ' + request.url
  response.writeHead(404);
  response.end()

server.listen 8888, ->
  console.log 'Server is listening on port 8888'

wsServer = new WebSocketServer
  httpServer: server,
  autoAcceptConnections: false

originIsAllowed = (origin) ->
  console.log("origin:", origin)
  return true

connectionPool = []

wsServer.on 'request', (request) ->
  if !originIsAllowed(request.origin)
    request.reject()
    console.log 'Connection from origin', request.origin, 'rejected.'
    return

  connection = request.accept 'echo-protocol', request.origin
  console.log 'Connection accepted.'
  connectionPool.push connection

  connection.on 'message', (message) ->
    i = 0
    while i < connectionPool.length
      connectionPool[i].send message.utf8Data
      i++
    console.log message.utf8Data
    console.log "connectionPool length:", connectionPool.length

  connection.on 'close', (reasonCode, description) ->
    console.log 'Peer', connection.remoteAddress, 'disconnected.'