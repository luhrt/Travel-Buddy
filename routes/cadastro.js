var express = require('express');
var router = express.Router();

// BOMBA
router.get('/',function(req, res, next){
    res.render('cadastro', {title: 'TravelBuddy'});
});

router.post('/cadastrar',async (req, res) => {
    const { email, senha } = req.body;
    const nome = email.split('@')[0];

    try{
        console.log(email, nome, senha);
        const [result] = await global.conexao.query('INSERT INTO user (user_email, user_name, user_password) VALUES (?, ?, ?)', [email, nome, senha]);

        const userId = result.insertId;
        console.log(`✅ Cadastro realizado com sucesso! Usuário '${nome}' (ID: ${userId}) inserido no banco de dados.`);
        res.redirect(`/profile/${userId}`);
    } catch(err) {
        console.error("❌ Erro ao tentar cadastrar usuário:", err);
        res.status(500).send("Erro ao cadastrar destino.");
    }
})

module.exports = router
