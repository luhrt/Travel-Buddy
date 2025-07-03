var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (global.user_id && global.user_id != 0) {
    res.redirect(`/profile/${user_Id}`);
  }
  res.render('index', { title: 'TravelBuddy' });
});

router.post('/login',async function(req, res, next){
  if(!global.user_id) {
    const email = req.body.email;
    const senha = req.body.senha;

    const result = await global.banco.buscarUsuario({email,senha});

    if(result.user_id){
      global.user_id = result.user_id;
      global.user_name = result.user_name;
      global.user_email = result.user_email;
      res.redirect('/explorar');
    } else {
      res.redirect('/');
    }

  } else {
    verificarLogin(res)
  }
})

function verificarLogin(res)
{
  if (!global.usuarioEmail || global.usuarioEmail == ""){
    res.redirect('/');
  } else {
    res.redirect('/explorar');
  }
}

module.exports = router;