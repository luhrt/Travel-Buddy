var express = require('express');
var router = express.Router();

const ITENS_POR_PAGINA = 8;
const POSTS_POR_PAGINA = 2;

// Página inicial
router.get('/', async function(req, res, next){
    const videos = await global.banco.buscarVideosPopulares(ITENS_POR_PAGINA, 0);
    const posts = await global.banco.buscarPostsPopulares(POSTS_POR_PAGINA, 0);
    console.log(videos.length)
    res.render('explorar', { title: 'TravelBuddy', videos, posts, search: '', videosOffset: ITENS_POR_PAGINA, postsOffset: POSTS_POR_PAGINA });
});

// Busca
router.get('/buscar', async function(req, res, next){
    const search = req.query.q || '';
    const videos = await global.banco.buscarVideosPorTitulo(search, ITENS_POR_PAGINA, 0);
    const posts = await global.banco.buscarPostsPorTitulo(search, POSTS_POR_PAGINA, 0);
    res.render('explorar', { title: 'TravelBuddy', videos, posts, search, videosOffset: ITENS_POR_PAGINA, postsOffset: POSTS_POR_PAGINA });
});

// Mostrar mais vídeos (AJAX)
router.get('/mais-videos', async function(req, res, next){
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.q || '';
    const videos = search
        ? await global.banco.buscarVideosPorTitulo(search, ITENS_POR_PAGINA, offset)
        : await global.banco.buscarVideosPopulares(ITENS_POR_PAGINA, offset);
    res.json(videos);
});

// Mostrar mais posts (AJAX)
router.get('/mais-posts', async function(req, res, next){
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.q || '';
    const posts = search
        ? await global.banco.buscarPostsPorTitulo(search, POSTS_POR_PAGINA, offset)
        : await global.banco.buscarPostsPopulares(POSTS_POR_PAGINA, offset);
    res.json(posts);
});

module.exports = router;