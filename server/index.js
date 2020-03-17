const keypressHandler = require('./js/keypressHandler');
const enqueue = require('./js/messageQueue.js').enqueue;

const PORT = 3000;
const URL = '127.0.0.1';

keypressHandler.initialize((message) => {
  if (['left', 'right', 'up', 'down'].includes(message)) {
    enqueue(message);
  } else {
    console.log('not an option');
  }
});

const httpHandler = require('./js/httpHandler');


const http = require('http');
const server = http.createServer(httpHandler.router);

server.listen(PORT, URL);

console.log('Server is running in the terminal!');
console.log(`Listening on http://${URL}:${PORT}`);
