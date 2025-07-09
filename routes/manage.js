var express = require('express');
var router = express.Router();

router.get('/',function(req, res, next){
    res.render('manage', {title: 'TravelBuddy'});
});

module.exports = router