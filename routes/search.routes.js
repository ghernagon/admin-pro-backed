/*
    Route: /api/search/
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt.middleware');
const { getSearch, getSearchByCollection } = require('../controllers/search.controller');

const router = Router();

router.get('/:term', validateJWT, getSearch);
router.get('/collection/:table/:term', validateJWT, getSearchByCollection);

module.exports = router;