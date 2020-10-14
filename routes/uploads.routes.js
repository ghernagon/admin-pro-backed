/*
    Route: /api/upload/
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validateJWT } = require('../middlewares/validate-jwt.middleware');
const { uploadFile } = require('../controllers/uploads.controller');

const router = Router();

router.use( expressFileUpload() );

router.put('/:collectionName/:id', validateJWT, uploadFile);

module.exports = router;