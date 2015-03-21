/**
 * Created by c275li on 3/21/15.
 */
var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

//var ex = '{"coord":{"lon":-0.13,"lat":51.51},"sys":{"type":1,"id":5091,"message":0.033,"country":"GB","sunrise":1426917602,"sunset":1426961711},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"base":"cmc stations","main":{"temp":279.48,"pressure":1022,"humidity":75,"temp_min":277.15,"temp_max":281.15},"wind":{"speed":3.1,"deg":350,"var_beg":320,"var_end":30},"clouds":{"all":56},"dt":1426910290,"id":2643743,"name":"London","cod":200}';
var openWeatherApiKey = "00d268b743c4b092d7872a51cbf3ddbe";

var KtoC = function(K) {
    return parseFloat(K - 273.15).toFixed(2);
};

var KtoF = function(K) {
    return 32 + (KtoC(K) * 9 / 5);
};

var req = function(location) {
    return "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&APPID=" + openWeatherApiKey;
};

var getWeather = function(location) {
    var self = this;
    request(req(location), function (err, response, res) {
        if (!err && response.statusCode === 200) {
            console.log("**Found weather for " + location);
            self.emit('data', createMsg(JSON.parse(res)));
        }
    });
};

var createMsg = function(res) {
    var weather = res.weather[0].main + ", " + res.weather[0].description + "<br>";
    weather += KtoF(res.main.temp) + " (hi: " + KtoF(res.main.temp_max) + ", lo: " + KtoF(res.main.temp_min) + ")<br>";
    weather += "Humidity: " + res.main.humidity;
    if (res.rain != null) weather += ", Rain(3h): " + res.rain["3h"] + "<br>"
    console.log(weather);
};

util.inherits(getWeather, EventEmitter);
module.exports = getWeather;
