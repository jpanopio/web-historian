var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
var query = require('querystring');
// require more modules/folders here!
var dirname = __dirname;
var filemap = {
  '/': dirname + '/public/index.html',
  '/styles.css': dirname +'/public/styles.css',
  '/loading.html' : dirname +'/public/loading.html'
};

exports.handleRequest = function (req, res) {
  
  var parsedURL = url.parse(req.url);

  if(req.method === 'GET'){
    if(parsedURL.pathname in filemap){
      var pathName = filemap[parsedURL.pathname];
      var fileStream = fs.createReadStream(pathName, {
        encoding: 'utf8'
      });
      fileStream.pipe(res);
    } else {
      archive.isUrlArchived(parsedURL.pathname, function(is) {
        if(is) {
          // Give the file
          var readStream = fs.createReadStream(
            archive.paths.archivedSites + '/' + parsedURL.pathname,
            { encoding: 'utf8' }
          );
          readStream.pipe(res);
        } else {
          // Return 404
          res.writeHead(404);
          res.end();
        }
      });
    }
  } else if(req.method === 'POST'){
    req.setEncoding('utf8');
    req.on('data', function(data){
      var parsed = query.parse(data);
      archive.isUrlArchived(parsed.url, function(is) {
        if(is) {
          res.writeHead(302, {Location: '/' + parsed.url});
        } else {
          // it doesn't exist
          archive.isUrlInList(parsed.url, function(is){
            if(!is){
              archive.addUrlToList(parsed.url);
            }
          });
          res.writeHead(302, {Location: '/loading.html'});
        }
        res.end();
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
};
