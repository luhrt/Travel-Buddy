const mysql = require('mysql2/promise')

async function ConectarBD() {
    console.log("Iniciando conexão...")
    if (global.conexao && global.conexao.state !== 'disconnected'){
        return global.conexao;
    }

    const conexao = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'travelbuddy'
    });

    console.log("Conexão iniciada com o MySQL!")

    global.conexao = conexao;
    return global.conexao;
}

// Funções aqui

ConectarBD();

module.exports = {}