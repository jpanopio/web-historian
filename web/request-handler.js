var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
// require more modules/folders here!
var filemap = {
  '/': './public/index.html'
};

exports.handleRequest = function (req, res) {
  var pathName = filemap[url.parse(req.url).pathname];

  if(pathName === undefined){
    res.writeHead(404);
    res.end();
  } else {
    var fileStream = fs.createReadStream(pathName, {
      encoding: 'utf8'
    });
    fileStream.pipe(res);
  }
};
