const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:id', async (req, res) => {
    const videoId = req.params.id;
    const conn = await db.ConectarBD();
    const [videos] = await conn.query(`
        SELECT v.*, u.user_name, u.user_pfp, c.country_name
        FROM video v
        JOIN user u ON v.user_id = u.user_id
        JOIN country c ON v.country_id = c.country_id
        WHERE v.video_id = ?
    `, [videoId]);
    const video = videos[0] || {};
    const [comentarios] = await conn.query(`
        SELECT cm.comment_id, cm.comment_text, cm.comment_date, u.user_name, u.user_pfp
        FROM comment cm
        JOIN user u ON cm.user_id = u.user_id
        WHERE cm.video_id = ?
        ORDER BY cm.comment_date DESC
    `, [videoId]);
    const [sugestoes] = await conn.query(`
        SELECT v.video_id, v.video_title, v.video_thumbnail, u.user_name
        FROM video v
        JOIN user u ON v.user_id = u.user_id
        WHERE v.video_id != ?
        ORDER BY RAND() LIMIT 5
    `, [videoId]);
    res.render('video', {
        video,
        comentarios,
        sugestoes,
        titulo: video.video_title || 'Vídeo'
    });
});

router.post('/:id/comentar', async (req, res) => {
    const videoId = req.params.id;
    const userId = req.session.user_id;
    const texto = req.body.comentario;
    if (userId && texto) {
        const conn = await db.ConectarBD();
        await conn.query('INSERT INTO comment (user_id, video_id, comment_text) VALUES (?, ?, ?)', [userId, videoId, texto]);
    }
    res.redirect('/video/' + videoId);
});

module.exports = router;