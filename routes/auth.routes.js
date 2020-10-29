const { validateJWT } = require('../middlewares/validate-jwt.middleware');

/*
    Route: /api/login
*/

const { Router } = require('express');
const { login, googleSignIn, refreshToken } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.middleware');

const router = Router();

router.post( '/', [
    check('email', 'Email is mandatory').isEmail(),
    check('password', 'Password is mandatory').not().isEmpty(),
    validateFields
],  login);

router.post( '/google', [
    check('token', 'Google token is mandatory').not().isEmpty(),
    validateFields
],  googleSignIn)

router.get( '/refresh',
    validateJWT,
    refreshToken
)


module.exports = router;