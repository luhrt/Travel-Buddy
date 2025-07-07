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

module.exports = router;