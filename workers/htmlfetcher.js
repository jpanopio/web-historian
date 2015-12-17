// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

// Iterate through sites.txt
archive.readListOfUrls(function(urlList){
  _.each(urlList, function(url){
    // Check if each site is archived
    if(url.length > 0){
      archive.isUrlArchived(url, function(is){
        // If the site is not archived:
        console.log('checked if ' + url +' is in sites.txt');
        if(!is){
          // Send a GET request to that site
          archive.downloadUrls([url]);
        }
      });
    }
  });
});
