/*
    Route: /api/users
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.middleware');
const { getUsers, createUser, updateUser } = require('../controllers/users.controller');

const router = Router();

router.get('/', getUsers);

// Middlewares to validate route
router.post(
    '/',
    [
        check('name', 'name is mandatory').not().isEmpty(),
        check('password', 'password is mandatory').not().isEmpty(),
        check('email', 'email is mandatory').isEmail(),
        validateFields
    ],
    createUser
);


router.put(
    '/:id',
    [
        check('name', 'name is mandatory').not().isEmpty(),
        check('email', 'email is mandatory').isEmail(),
        // check('role', 'role is mandatory').not().isEmpty(),
        validateFields
    ],
    updateUser
);



module.exports = router;