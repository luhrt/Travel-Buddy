var express = require('express');
var router = express.Router();

// Cadastro
router.get('/',function(req, res, next){
    res.render('cadastro', {title: 'TravelBuddy'});
});

router.post('/cadastrar',async (req, res) => {
    const { email, senha } = req.body;
    const nome = email.split('@')[0];

    try{
        console.log(email, nome, senha);
        const [result] = await global.conexao.query('INSERT INTO user (user_email, user_name, user_password) VALUES (?, ?, ?)', [email, nome, senha]);

        req.session.user_id = result.insertId;
        global.user_name = nome
        global.user_email = email
        
        res.redirect(`/profile/${req.session.user_id}`);
    } catch(err) {
        console.error(err);
        res.status(500).send("Erro ao cadastrar destino.");
    }
})

module.exports = router