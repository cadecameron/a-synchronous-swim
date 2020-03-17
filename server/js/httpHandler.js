const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const dequeue = require('./messageQueue.js').dequeue
const _ = require('underscore')

const url = require('url');
const dequeue = require('./messageQueue.js').dequeue

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////


// this function currently only handles an OPTIONS request
module.exports.router = (req, res, next = () => { }) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  // check statement to handle different endpoints and response methods
  // '/random', 'GET', 'POST' (backgrounds)
  const pathString = url.parse(req.url).pathname;

  // handle basic 'GET' response
  if (req.method === 'GET' && pathString === '/random') {
    res.writeHead(200, headers);
    const random = ['left', 'right', 'up', 'down'][Math.floor(Math.random() * 4)];
    res.end(random); // return random response
  } else if (req.method === "GET" && pathString === '/queue') {
    res.writeHead(200, headers);
    const item = dequeue();
    if (item) {
      res.end(item);
      next();
    } else {
      res.end();
      next();
    }
  } else if (req.method === "GET" && pathString === '/background') {
    fs.readFile(module.exports.backgroundImageFile, (err, image) => {
      if (err) {
        console.log('ERROR 404 ERROR <-----------------------------------------------------')
        res.writeHead(404, headers);
        console.log(res._responseCode);
        res.end();
        next();
      } else {
        var base64Image = new Buffer(image, 'binary').toString('base64');
        const imageHeader = _.extend({}, headers)
        imageHeader['Content-Type'] = 'image/jpeg';
        imageHeader['Content-Length'] = base64Image.length;
        res.writeHead(200, imageHeader);
        res.end(base64Image);
        next();
      }
    });
  } else if (req.method === "POST" && pathString === "/upload"){
    var bufferArray = [];
    req.on('data', (chunk) => {
      bufferArray.push(chunk);
    });
    req.on('end', function() {
      const buffer = Buffer.concat(bufferArray);
      const post = multipart.getFile(buffer);
      if (!post || post.data === null){
        console.log('post', post);
        post = multipart.parse(buffer)
      } else {
        post = post.data;
      }
      fs.writeFile(module.exports.backgroundImageFile, post, (err)=>{
        if (err){
          console.log("WRITE ERROR IN UPLOAD IMAGE", err);
        } else {
          console.log("WRITE SUCCESS");
        }
      });
    })
    res.writeHead(201, headers);
    res.end();
    next();
  } else {
    res.writeHead(200, headers);
    res.end();
    next();
  }

  // handle basic 'GET' response with '/queue' endpoint
  if (req.method === 'GET' && path === '/queue') {
    if (messageQueue && (messageQueue.length > 0)) {
      console.log('Found a message in the queue to serve to client!');
      res.end(dequeue());
    }
  }

  //res.write('Welcome to my server!') // res.write puts things to the DOM
  // invoke next() at the end of a request to help with testing!
};


////////////////////////////////////////////////////////////////////////////////
// TODO ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


// add functions that handle different get methods (i.e. one function for 'up',
// another function for 'down', etc.)