/**
 * Created by c275li on 3/15/15.
 */
var google = require('googleapis');
var urlshortener = google.urlshortener('v1');

var printResult = function(err, result) {
    if (err) {
        console.log('Error occurred: ', err);
    } else {
        console.log('Result: ', result);
    }
};

urlshortener.url.get({ shortUrl: 'http://goo.gl/DdUKX' }, printResult);
urlshortener.url.insert({ resource: {
    longUrl: 'http://somelongurl.com' }
}, printResult);