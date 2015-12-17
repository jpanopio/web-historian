// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

// Iterate through sites.txt
archive.readListOfUrls(function(urlList){
  _.each(urlList, function(url){
  // Check if each site is archived
    archive.isUrlArchived(url, function(is){
      // If the site is not archived:
      if(!is){
        // Send a GET request to that site
        dowloadUrls([url]);
      }
    });
  });
});