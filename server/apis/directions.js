/**
 * Created by c275li on 3/19/15.
 */
var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var googleDirectionsApiKey = "AIzaSyBV0AUttBpjjaQlYVUnR_vaf83v5BguLl4";

var req = function(from, to, by) {
    var url = "https://maps.googleapis.com/maps/api/directions/json?origin=%s&destination=%s&mode=%s&key=%s";
    return util.format(url, from, to, by, googleDirectionsApiKey);
};

var getDirections = function(from, to, by) {
    var self = this;
    console.log(req(from, to, by));
    request(req(from, to, by), function (err, response, res) {
        if (!err && response.statusCode === 200) {
            console.log("**Found Directions from " + from + ", to " + to + ", by " + by);
            var leg = JSON.parse(res).routes[0].legs[0];
            self.emit('data', createMsg(leg));
        }
    });
};

// takes an array of steps and process them
var createMsg = function(leg) {
    var steps = leg.steps;
    var content = [];
    content.push("-- Distance: " + leg.distance.text + " --<br>");
    content.push("-- Duration: " + leg.duration.text + " --<br>");
    for (var i=1; i<=steps.length; i++) {
        var step = steps[i-1];
        var str = '- ' + step.html_instructions + '(' + step.duration.text + ' ' + step.distance.text + ')<br>';
        content.push(str);
    }
    //console.log(content.join(""));
    return content.join("");
};

util.inherits(getDirections, EventEmitter);
module.exports = getDirections;