var express = require('express');
var router = express.Router();

router.get('/',async (req, res,) => {
  const logadoId = req.session.user_id;
  if (!logadoId || logadoId == 0) {
      res.redirect(`/`);
    }

    const user = await global.banco.buscarUsuarioPorId(logadoId);

    if (!user) {
      return res.status(404).send('Usuário inválido');
    }

    const videos = await global.banco.buscarVideosDeUsuario(user);
    const posts = await global.banco.buscarPostsDeUsuario(user);
    const pais = await global.banco.buscarPaisPorId(user.country_id ? user.country : 1);
    console.log(videos.length,posts.length)
  res.render('roteiro', {user, videos, posts, pais});
});

module.exports = router