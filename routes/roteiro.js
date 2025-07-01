var express = require('express');
var router = express.Router();

// BOMBA
router.get('/',function(req, res, next){
    res.render('roteiro', {title: 'TravelBuddy'});
});

module.exports = router