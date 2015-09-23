var News = require('news'),
    Directions = require('directions'),
    Weather = require('weather');

var defaultEmail = function (to, body) {
    var email_lines = [];
    email_lines.push("From: me");
    email_lines.push("To: 7542132256@tmomail.net");
    email_lines.push('Content-type: text/html');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push("");
    email_lines.push(body);

    var email = email_lines.join("\r\n").trim();

    var base64EncodedEmail = new Buffer(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    return base64EncodedEmail;
}

var generate = function(info, emailSender) {
    var command = info.snippet.replace(/['"]+/g, ''); // remove double quotes
    var r;
    if (command.indexOf("news") > -1) {
        var story;
        if (command.indexOf("popular") > -1) story = "Most Popular";
        else if (command.indexOf("congress") > -1) story = "Congress";
        else story = "";
        r = new News(story);
    } else if (command.indexOf("dir") > -1) {
        if (command.indexOf("b:") < 0) command = command + "b: driving";
        var from = command.slice(command.indexOf("f:")+2, command.indexOf("t:")).trim();
        var to = command.slice(command.indexOf("t:")+2, command.indexOf("b:")).trim();
        var by = command.slice(command.indexOf("b:")+2).trim();
        r = new Directions(from, to, by);
    } else if (command.indexOf("weather") > -1) {
        var location = command.slice(command.indexOf("weather") + 7).trim();
        r = new Weather(location);
    } else {
        r = "";
    }
    r.on('data', function(data) {
        console.log("Ready to send email");
        emailSender(defaultEmail(info.To, data));
    });
};

module.exports.generate = generate;