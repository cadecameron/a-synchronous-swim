const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

const url = require('url');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

console.log(path.dirname(__dirname))

// this function currently only handles an OPTIONS request
module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers); // var randomCmd = ??; res.end(randomCmd)

  // check statement to handle different endpoints and response methods
  // '/random', 'GET', 'POST' (backgrounds)
  const path = url.parse(req.url).pathname;

  // handle basic 'GET' response
  if (req.method === 'GET' && path === '/random') {
    const random = ['left', 'right', 'up', 'down'][Math.floor(Math.random() * 4)];
    res.end(random); // return random response
  }

  //res.write('Welcome to my server!') // res.write puts things to the DOM
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};


////////////////////////////////////////////////////////////////////////////////
// TODO ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


// add functions that handle different get methods (i.e. one function for 'up',
// another function for 'down', etc.)