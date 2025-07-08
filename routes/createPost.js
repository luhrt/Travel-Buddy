var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET
router.get('/',function(req, res, next){
    res.render('createPost', {title: 'TravelBuddy'});
});

// POST
router.post('/', upload.single('post_image'), async function(req, res, next){
    try {
        const userId = req.session.user_id;
        if (!userId) return res.redirect('/');

        const { post_title, post_text } = req.body;
        let post_image = null;
        if (req.file) {
            post_image = '/uploads/' + req.file.filename;
        }

        // Busca país do usuário
        const user = await global.banco.buscarUsuarioPorId(userId);
        const country_id = user.country_id || 1;

        // Salva no banco
        await salvarPost(userId, country_id, post_title, post_text, post_image);

        // Redireciona para o perfil do usuário
        res.redirect(`/profile/${userId}`);
    } catch (err) {
        next(err);
    }
});

// Função para salvar post no banco
async function salvarPost(user_id, country_id, post_name, post_desc, post_image) {
    const conexao = await global.banco.ConectarBD();
    const sql = `
        INSERT INTO post (user_id, country_id, post_name, post_desc, post_image)
        VALUES (?, ?, ?, ?, ?)
    `;
    await conexao.query(sql, [user_id, country_id, post_name, post_desc, post_image]);
}

module.exports = router;