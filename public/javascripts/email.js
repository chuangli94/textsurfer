var News = require('./../../apis/news'),
    Directions = require('./../../apis/directions');

var defaultEmail = function (body) {
    var email_lines = [];
    email_lines.push("From: \"PaulFrank\" <chuang.li94@gmail.com>");
    email_lines.push("To: 7542132256@tmomail.net");
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push("");
    email_lines.push(body);
//email_lines.push("<b>And the bold text goes here</b>");

    var email = email_lines.join("\r\n").trim();

    var base64EncodedEmail = new Buffer(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    return base64EncodedEmail;
}

var generate = function(command, emailSender) {
    var r;
    if (command.indexOf("news") > -1) {
        r = new News("");
    } else if (command.indexOf("dir") > -1) {
        command = command.replace(/['"]+/g, ''); // remove double quotes
        if (command.indexOf("b:") < 0) command = command + "b: driving";
        var from = command.slice(command.indexOf("f:")+2, command.indexOf("t:")).trim();
        var to = command.slice(command.indexOf("t:")+2, command.indexOf("b:")).trim();
        var by = command.slice(command.indexOf("b:")+2).trim();
        r = new Directions(from, to, by);
    } else {
        r = "";
    }
    r.on('data', function(data) {
        console.log("Ready to send email");
        emailSender(defaultEmail(data));
    });
};

module.exports.generate = generate;