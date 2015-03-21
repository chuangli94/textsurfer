var express = require('express');
var router = express.Router();
var google = require('googleapis');
var gmail = require("../public/javascripts/gmail");

var googleConfig = {
    clientID: '199448248265-rf0m7guf90uoab3nqn6b6lf5oqaeb6ad.apps.googleusercontent.com',
    clientSecret: 'QYsKt7UfL5eA4XvR2hMQsO0O',
    redirectURL: 'https://textsurfer.herokuapp.com/auth'
};
var oauth2Client = new google.auth.OAuth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.redirectURL);
var auth = false;

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', {title: 'TextSurfer'});

    if (!auth)
    {
        var url = oauth2Client.generateAuthUrl({
            access_type: 'offline', // will return a refresh token
            scope: [
                'https://mail.google.com',
                'https://www.googleapis.com/auth/gmail.modify' ] // can be a space-delimited string or an array of scopes
        });
        res.redirect(url);
    }
    else {
        gmail.listen(oauth2Client);
        res.render('index', {title: 'TextSurfer'});
    }
});

router.get('/auth', function(req, res, next) {
    var code = req.query.code;
    if (code)
    {
        oauth2Client.getToken(code, function(err, tokens) {
            if (err) {
                console.log("Error getting token!");
                return;
            }
            //set tokens to the client
            // TODO: tokens should be set by OAuth2 client.
            oauth2Client.setCredentials(tokens);
            auth = true;
        });
    }
    res.redirect('/');
});

module.exports = router;
