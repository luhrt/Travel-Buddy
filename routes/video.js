var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    const video_id = req.params.id;

    try {
        const video = await global.banco.buscarVideoPorId(video_id);
        const user = await global.banco.buscarUsuarioPorId(video.user_id);
        
        if (!video || !user) {
            return res.status(404).send('Video Inválido');
        }
        
        const pais = await global.banco.buscarPaisPorId(user.country ? user.country : 1);
        const seguidores = await global.banco.buscarSeguidores(user.user_id);
        const videos = await global.banco.buscarVideosPopulares(8, 0);

        res.render('video', {video, user, pais, seguidores, videos, session: req.session});
    } catch(err) {
        return res.status(500).send('Vídeo não encontrado');
    }
});

module.exports = router