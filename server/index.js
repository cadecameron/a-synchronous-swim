

const keypressHandler = require('./js/keypressHandler');
const enqueue = require('./js/messageQueue.js').enqueue

// keypressHandler.initialize(message => console.log(`Message received: ${message}`));
keypressHandler.initialize((message) => {
  if (['left', 'right', 'up', 'down'].includes(message)) {
    enqueue(message);
  } else {
    console.log('not an option')
  }
});

const httpHandler = require('./js/httpHandler');


const http = require('http');
const server = http.createServer(httpHandler.router);

const port = 3000;
const ip = '127.0.0.1';
server.listen(port, ip);

console.log('Server is running in the terminal!');
console.log(`Listening on http://${ip}:${port}`);
