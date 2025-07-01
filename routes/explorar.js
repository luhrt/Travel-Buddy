var express = require('express');
var router = express.Router();

// BOMBA
router.get('/',function(req, res, next){
    res.render('explorar', {title: 'TravelBuddy'});
});

module.exports = router