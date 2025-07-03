const request = require('supertest');
const express = require('express');
const cadastroRouter = require(__dirname + '/../routes/cadastro');

global.conexao = {
  query: jest.fn(async (sql, params) => {
    return [{ insertId: 123 }];
  })
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/cadastro', cadastroRouter);

describe('POST /cadastro/cadastrar', () => {
  it('deve cadastrar usuário e redirecionar para profile', async () => {
    const response = await request(app)
      .post('/cadastro/cadastrar')
      .send({ email: 'teste@exemplo.com', senha: 'senha123' });

    expect(global.conexao.query).toHaveBeenCalledWith(
      expect.any(String),
      ['teste@exemplo.com', 'teste', 'senha123']
    );
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/profile/123');
  });

  it('deve retornar erro se houver exceção', async () => {
    global.conexao.query.mockRejectedValueOnce(new Error('Erro no banco'));

    const response = await request(app)
      .post('/cadastro/cadastrar')
      .send({ email: 'falha@exemplo.com', senha: 'senha123' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Erro ao cadastrar destino.');
  });
});
