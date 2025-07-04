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

async function buscarUsuario(user) {
    const conexao = await ConectarBD();
    const sql = "select * from user where user_email=? and user_password=?;";
    const [userResult] = await conexao.query(sql,[user.email, user.senha]);
    return userResult && userResult.length>0 ? userResult[0] : {};
}

// Funções aqui

ConectarBD();

module.exports = {
    buscarUsuario
}