/**
 * Created by c275li on 3/17/15.
 */
var google = require('googleapis');
var gmailClass = google.gmail('v1');
var emailGenerator = require('./email');
var http = require('http');

var oAuth2Client;
var expire_time;
var mailChecker;
var frequency = 15000;
var label_id = "Label_2";

var getMessage = function (msgId) {
    gmailClass.users.messages.get({
        auth: oAuth2Client,
        userId: "me",
        id: msgId,
        format: "minimal"
    }, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            var content = JSON.stringify(res.snippet);
            console.log("Retrieved email " + msgId + " successfully, email: " + content);
            if (content.indexOf("STOP") > -1) {
                console.log("Received command to stop");
                clearInterval(mailChecker);
                return;
            }
            emailGenerator.generate(content, sendEmail);
        }
    });

};
var sendResponse = function (email_id) {
    console.log("Processing Email ID: " + email_id);
    markRead(email_id);
    getMessage(email_id);
};
var markRead = function (email_id) {
    gmailClass.users.messages.modify({
        auth: oAuth2Client,
        userId: "me",
        id: email_id,
        resource: {
            "removeLabelIds": ["UNREAD"]
        }
    }, function (err) {
        if (err)
            console.log(err);
    });
};

var refreshToken  = function() {
    console.log("Refreshing tokens");
    oAuth2Client.refreshAccessToken(function(err, tokens) {
        if (err) {
            console.log("Error refreshing tokens: " + err);
            clearInterval(mailChecker);
            return;
        }
        oAuth2Client.setCredentials(tokens);
        expire_time = tokens.expiry_date;
        console.log("Tokens refreshed, will expire at: " + expire_time)
    });
};

var getEmails = function () {
    console.log("Checking emails...");
    mailChecker = setInterval(function () {
        gmailClass.users.messages.list({
            auth: oAuth2Client,
            userId: "me",
            labelIds: label_id,
            q: "is:unread"
        }, function (err, res) {
            if (err) {
                console.log(err);
                if (err.status === 401) refreshToken();
            } else {
                var emails = res.messages;
                if (emails == null) {
                    return;
                }
                for (var i = 0; i < emails.length; i++) {
                    var email_id = emails[i].id;
                    sendResponse(email_id);
                }
            }
        });
        if (Date.now() >= expire_time) {
            console.log("Token has expried");
            http.get("https://textsurfer.herokuapp.com/ping");
            refreshToken();
        }
    }, frequency);
};
var getLabel = function () {
    gmailClass.users.labels.list({
        auth: oAuth2Client,
        userId: "me"
    }, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            //var lables = JSON.parse(res);
            console.log(res);
        }
    });
};

var sendEmail = function (data) {
    gmailClass.users.messages.send({
        auth: oAuth2Client,
        userId: "me",
        resource: {
            raw: data
        }
    }, function (err, results) {
        if (err)
            console.log("Sending Email Failed: " + err);
        else
            console.log("Email successfully sent " + results);
    });
};


var listen = function (client, expire) {
    oAuth2Client = client;
    expire_time = expire;
    console.log("Tokens will expire at: " + expire_time)
    getEmails();
}


module.exports.listen = listen;

