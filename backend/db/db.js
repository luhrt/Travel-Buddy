const mysql = require('mysql2/promise');

async function conectarBD()
{
    // verifica se já existe uma conexao valida com o BD
    // armazenada no objeto GLOBAL
    if (global.conexao && global.conexao.state !== 'disconnected')
    {
        return global.conexao;
    }

    // caso não exista uma conexao, deve-se cria-la
    const conexao = mysql.createConnection(
        {
            host     : 'localhost',
            port     : 3000,
            user     : 'root',
            password : '',
            database : 'travelbuddy'
        }
    );

    // guarda a nova conexao no objeto GLOBAL
    global.conexao = conexao;
    
    // retorna a conexao criada
    return global.conexao;
}
