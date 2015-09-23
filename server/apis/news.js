/**
 * Created by c275li on 3/18/15.
 */
var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var nytMostPopularKey = "37f4eda8c3cad52226a558b823d4fd34:19:71621892";
var nytArticleSearchKey = "38bac914732f63d758b697f4ff480ea2:6:71621892";
var nytCongressKey = "03c9d6484e5021959bd4bb888b7fdf6f:7:71621892";
var nytTopStoriesKey = "4aaae9a9548a5c6bd6baa13b38995d50:3:71621892";

var req = function(key) {
    return "http://api.nytimes.com/svc/topstories/v1/home.json?api-key=" + key;
};

var getStories = function(type) {
    var self = this;
    var key;
    switch (type)
    {
        case "Most Popular":
            key=nytMostPopularKey; break;
        case "Articles":
            key=nytArticleSearchKey; break;
        case "Congress":
            key=nytCongressKey; break;
        default:
            key=nytTopStoriesKey; break;
    }
    request(req(key), function (err, response, res) {
        if (!err && response.statusCode === 200) {
            console.log("**Top stories are back!");
            self.emit('data', createMsg(JSON.parse(res).results));
        }
    })
};

var createMsg = function(res) {
    var emailContent = [];
    for (var i=1; i<=res.length; i++) {
        var item = res[i-1];
        var news = i + ". " + item.section + "-" + item.subsection + ":    " + item.title + "<br>";
        emailContent.push(news);
    }
    //console.log(emailContent.join(""));
    return emailContent.join("");
};

util.inherits(getStories, EventEmitter);

module.exports = getStories;