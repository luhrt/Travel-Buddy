const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Rota de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM user WHERE user_email = ? AND user_senha = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      res.status(500).json({ success: false, message: 'Erro no servidor' });
      return;
    }

    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false, message: 'Credenciais inválidas' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
