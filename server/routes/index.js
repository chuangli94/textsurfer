var express = require('express');
var router = express.Router();
var oauth = require("../apis/oauth");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'TextSurfer'});
});

router.get('/auth', function(req, res, next) {
    var code = req.query.code;
    if (code == null)
    {
        var url = oauth.authenticate();
        res.redirect(url);
        return;
    }
    oauth.start(code);
    res.redirect('/thankyou');
});

router.get('/ping', function(req, res, next) {
    res.render('ping', {title: 'TextSurfer'});
});

router.get('/howto', function(req, res, next) {
    res.render('howto', {title: 'TextSurfer - HowTo'});
});

router.get('/thankyou', function(req,res,next){
    res.render('thankyou', {title: 'TextSurfer'});
});

module.exports = router;
