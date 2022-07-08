const express = require('express');
const router = require('./routes')('token-1');
const server = express();

const port = 3000;

server.use('/', router);

server.use((req, res, next) => {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);   
});

server.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  })     
});

server.listen(port, () => {  
  console.log('Server started on port: ' + port);
});

module.exports = server;