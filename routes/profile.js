var express = require('express');
var router = express.Router();

// Perfil
router.get('/:id', async (req, res) => {
    const UserId = req.params.id;
    const logadoId = req.session.user_id;

    try {
        const user = await global.banco.buscarUsuarioPorId(UserId);

        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        
        const pais = await global.banco.buscarPaisPorId(user.country ? user.country : 1);
        const videos = await global.banco.buscarVideosDeUsuario(user);
        const posts = await global.banco.buscarPostsDeUsuario(user);
        const seguidores = await global.banco.buscarSeguidores(user.user_id);
        
        let seguindo = false;
        if (logadoId && logadoId !== user.user_id) {
            seguindo = await global.banco.estaSeguindo(logadoId, user.user_id);
        }

        res.render('profile', {user, pais, videos, posts, seguidores, seguindo, session: req.session,});
    } catch(err) {
        return res.status(500).send('Usuário não encontrado');
    }
});

module.exports = router;