var express = require('express');
var router = express.Router();

// BOMBA
router.get('/', function(req, res, next) {
    res.render('profile', {
        title: 'TravelBuddy',
        user: { user_name: 'Nome de Teste' } // Adiciona um objeto user para o EJS
    });
});

module.exports = router;