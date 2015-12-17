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

  if(parsedURL.pathname in filemap){
    var pathName = filemap[parsedURL.pathname];
    var fileStream = fs.createReadStream(pathName, {
      encoding: 'utf8'
    });
    fileStream.pipe(res);
  } else {
    archive.isUrlArchived(parsedURL.pathname, function(is) {
      if(is) {
        console.log('url is archived');
        // Give the file
        var readStream = fs.createReadStream(archive.paths.archivedSites + '/' + parsedURL.pathname,{
          encoding: 'utf8'
        });
        readStream.pipe(res);
      } else {
        console.log('url is not archived');
        // Return 404
        res.writeHead(404);
        res.end();
      }
    });
  }
};
