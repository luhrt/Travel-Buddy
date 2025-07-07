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

async function buscarUsuarioPorId(UserId) {
    const conexao = await ConectarBD();
    const sql = "select * from user where user_id=?;";
    const [userResult] = await conexao.query(sql,[UserId]);
    return userResult && userResult.length>0 ? userResult[0] : {};
}

async function buscarUsuario(user) {
    const conexao = await ConectarBD();
    const sql = "select * from user where user_email=? and user_password=?;";
    const [userResult] = await conexao.query(sql,[user.email, user.senha]);
    return userResult[0];
}

async function buscarPaisPorId(CountryId) {
    const conexao = await ConectarBD();
    const sql = "select * from country where country_id=?;";
    const [userResult] = await conexao.query(sql,[CountryId]);
    return userResult[0];
}

async function buscarVideosDeUsuario(user) {
    const conexao = await ConectarBD();
    const sql = "select * from video where user_id=?;";
    const [videoResult] = await conexao.query(sql,[user.user_id]);
    return videoResult;
}

async function buscarPostsDeUsuario(user) {
    const conexao = await ConectarBD();
    const sql = "select * from post where user_id=?;";
    const [postResult] = await conexao.query(sql,[user.user_id]);
    return postResult;
}

async function buscarSeguidores(userId) {
    const conexao = await ConectarBD();
    const sql = `
        SELECT u.*
        FROM follow f
        JOIN user u ON f.follower_id = u.user_id
        WHERE f.followed_id = ?;
    `;
    const [seguidores] = await conexao.query(sql, [userId]);
    return seguidores;
}

async function estaSeguindo(followerId, followedId) {
    const conexao = await ConectarBD();
    const sql = `
        SELECT 1
        FROM follow
        WHERE follower_id = ? AND followed_id = ?
        LIMIT 1;
    `;
    const [rows] = await conexao.query(sql, [followerId, followedId]);
    return rows.length > 0;
}

ConectarBD();

module.exports = {
    buscarUsuario,
    buscarUsuarioPorId,
    buscarPaisPorId,
    buscarVideosDeUsuario,
    buscarPostsDeUsuario,
    buscarSeguidores,
    estaSeguindo
}