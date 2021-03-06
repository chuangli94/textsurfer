/**
 * Created by c275li on 3/27/15.
 */
var google = require('googleapis');
var gmail = require("./gmail");
var fs = require('fs');

var googleConfig = {
    clientID: '199448248265-rf0m7guf90uoab3nqn6b6lf5oqaeb6ad.apps.googleusercontent.com',
    clientSecret: 'QYsKt7UfL5eA4XvR2hMQsO0O',
    //redirectURL: 'https://textsurfer.herokuapp.com/auth'
    redirectURL: 'http://localhost:5000/auth'
};
var oauth2Client = new google.auth.OAuth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.redirectURL);
var auth = false;

var authenticate = function() {
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        approval_prompt: 'force', // user sees consent page
        scope: [
            'https://mail.google.com',
            'https://www.googleapis.com/auth/gmail.modify'] // can be a space-delimited string or an array of scopes
    });
    return url;
}

var start = function(code) {
    oauth2Client.getToken(code, function(err, tokens) {
        if (err) {
            console.log("Error getting token: " + err);
            return;
        }
        //save token to a local file
        fs.writeFile('./tokens.json', JSON.stringify(tokens), function(err) {
            if (err) return console.log(err);
        });
        //set tokens to OAuth2 client.
        oauth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        });
        gmail.listen(oauth2Client, tokens.expiry_date);
    });
}

module.exports.authenticate = authenticate;
module.exports.start = start;