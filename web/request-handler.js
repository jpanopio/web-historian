var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
// require more modules/folders here!
var dirname = __dirname;
var filemap = {
  '/': dirname + '/public/index.html',
  '/styles.css': dirname +'/public/styles.css'
};

exports.handleRequest = function (req, res) {
  
  var parsedURL = url.parse(req.url);
  var pathName = filemap[parsedURL.pathname];

  if(pathName === undefined){
    res.writeHead(404);
    res.end();
  } else if(req.method === 'GET') {
    // is this a REST request?
      // do REST things

    //otherwise not found
  } else {
    var fileStream = fs.createReadStream(pathName, {
      encoding: 'utf8'
    });
    fileStream.pipe(res);
  }
};
