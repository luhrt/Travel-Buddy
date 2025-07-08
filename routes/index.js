var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user_id && req.session.user_id != 0) {
    res.redirect(`/explorar`);
  }
  res.render('index', {});
});

router.post('/login',async function(req, res, next){
  if(!req.session.user_id) {
    const email = req.body.email;
    const senha = req.body.senha;

    const result = await global.banco.buscarUsuario({email,senha});

    if(result.user_id){
      req.session.user_id = result.user_id;
      global.user_name = result.user_name;
      global.user_email = result.user_email;
      res.redirect(`/profile/${req.session.user_id}`);
    } else {
      res.redirect(`/`);
    }

  } else {
    verificarLogin(res)
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

function verificarLogin(res)
{
  if (!global.usuarioEmail || global.usuarioEmail == ""){
    res.redirect('/');
  } else {
    res.redirect('/explorar');
  }
}

router.post('/follow', async (req, res) => {
  try {
    const followed_id = req.body.followed_id;
    const follower_id = req.session.user_id;
    
    if (!follower_id) { return res.status(401).json({ message: 'Usuário não autenticado.' }); }
    if (!follower_id) { return res.status(400).json({ message: 'Faça login para seguir outros usuários.' }); }

    if (follower_id === followed_id) {
      return res.status(400).json({ message: 'Você não pode seguir a si mesmo.' });
    }

    const [seguindo] = await global.conexao.query(
      'SELECT 1 FROM follow WHERE follower_id = ? AND followed_id = ?',
      [follower_id, followed_id]
    );

    if (seguindo.length > 0) {
      return res.status(400).json({ message: 'Você já está seguindo este usuário.' });
    }

    const [result] = await global.conexao.query('INSERT INTO follow (follower_id, followed_id) VALUES (?, ?)', [follower_id, followed_id]);

    return res.json({ message: 'Agora você está seguindo este usuário!' });
  } catch(err) {
    return res.status(500).json({ message: 'Erro ao seguir usuário.' });
  }
});

router.post('/unfollow', async (req, res) => {
  try {
    const followed_id = req.body.followed_id;
    const follower_id = req.session.user_id;

    if (!follower_id) { return res.status(401).json({ message: 'Usuário não autenticado.' }); }
    if (!followed_id) { return res.status(400).json({ message: 'ID do usuário a ser deixado de seguir é obrigatório.' }); }

    const [seguindo] = await global.conexao.query(
      'SELECT 1 FROM follow WHERE follower_id = ? AND followed_id = ?',
      [follower_id, followed_id]
    );

    const [result] = await global.conexao.query(
      'DELETE FROM follow WHERE follower_id = ? AND followed_id = ?',
      [follower_id, followed_id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Você não estava seguindo este usuário.' });
    }

    return res.json({ message: 'Você deixou de seguir este usuário.' });
  } catch(err) {
    return res.status(500).json({ message: 'Erro em parar de seguir.' });
  }
});

module.exports = router;