var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '/../web/public'),
  archivedSites: path.join(__dirname, '/../archives/sites'),
  list: path.join(__dirname, '/../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// call back take an array of urls as a parameter
exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
    if(err){
      throw err;
    }
    var fileLines = data.trim().split('\n');
    console.log('there are '+ fileLines.length+ ' urlLines');
    callback(fileLines);
  });
};

exports.isUrlInList = function(urlString, callback) {
  exports.readListOfUrls(function(urlList){
    callback(_.contains(urlList, urlString));
  });
};

exports.addUrlToList = function(urlString, callback) {
  var fileStream = fs.createWriteStream(exports.paths.list, {flags: 'a', encoding: 'utf8'});
  fileStream.write(urlString + '\n');
  fileStream.end();
  if(callback){
    callback();
  }
};

exports.isUrlArchived = function(urlString, callback) {
  fs.stat(exports.paths.archivedSites + '/' + urlString, function(error, stats){
    if(error){
      callback(false);
    } else{
      callback(stats.isFile());
    }
  });
};

exports.downloadUrls = function(urlList) {
  // Create files in the archivedSites with the names in urlList
  _.each(urlList, function(urlString){
    var fileStream = fs.createWriteStream(exports.paths.archivedSites + '/' + urlString);
    http.request({hostname: urlString}, function(response) {
      response.pipe(fileStream);
    }).end();
  });
};
