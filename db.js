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
    // conexao.query(";");
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

async function buscarVideosPopulares(limit, offset) {
    const conexao = await ConectarBD();
    const sql = `
        SELECT v.*, u.user_name, u.user_pfp, c.country_name
        FROM video v
        JOIN user u ON v.user_id = u.user_id
        JOIN country c ON v.country_id = c.country_id
        ORDER BY v.video_id DESC
        LIMIT ? OFFSET ?;
    `;
    const [videos] = await conexao.query(sql, [limit, offset]);
    return videos;
}

async function buscarPostsPopulares(limit, offset) {
    const conexao = await ConectarBD();
    const sql = `
        SELECT p.*, u.user_name, u.user_pfp, c.country_name
        FROM post p
        JOIN user u ON p.user_id = u.user_id
        JOIN country c ON p.country_id = c.country_id
        ORDER BY p.post_id DESC
        LIMIT ? OFFSET ?;
    `;
    const [posts] = await conexao.query(sql, [limit, offset]);
    return posts;
}

async function buscarVideosPorTitulo(q, limit, offset) {
    const conexao = await ConectarBD();
    const sql = `
        SELECT v.*, u.user_name, u.user_pfp, c.country_name
        FROM video v
        JOIN user u ON v.user_id = u.user_id
        JOIN country c ON v.country_id = c.country_id
        WHERE v.video_title LIKE ?
        ORDER BY v.video_id DESC
        LIMIT ? OFFSET ?;
    `;
    const [videos] = await conexao.query(sql, [`%${q}%`, limit, offset]);
    return videos;
}

async function buscarPostsPorTitulo(q, limit, offset) {
    const conexao = await ConectarBD();
    const sql = `
        SELECT p.*, u.user_name, u.user_pfp, c.country_name
        FROM post p
        JOIN user u ON p.user_id = u.user_id
        JOIN country c ON p.country_id = c.country_id
        WHERE p.post_name LIKE ?
        ORDER BY p.post_id DESC
        LIMIT ? OFFSET ?;
    `;
    const [posts] = await conexao.query(sql, [`%${q}%`, limit, offset]);
    return posts;
}

ConectarBD();

module.exports = {
    ConectarBD,
    buscarUsuario,
    buscarUsuarioPorId,
    buscarPaisPorId,
    buscarVideosDeUsuario,
    buscarPostsDeUsuario,
    buscarSeguidores,
    estaSeguindo,
    buscarVideosPopulares,
    buscarPostsPopulares,
    buscarVideosPorTitulo,
    buscarPostsPorTitulo
}