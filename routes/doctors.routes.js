/*
    Route: /api/doctors
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt.middleware');
const { validateFields } = require('../middlewares/validate-fields.middleware');
const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctors.controller');
const { check } = require('express-validator');


const router = Router();

router.get('/', getDoctors);

router.post('/',
    [
        validateJWT,
        check('name', 'Doctor name is mandatory').not().isEmpty(),
        check('hospital', 'Hospital id is mandatory').not().isEmpty(),
        check('hospital', 'Hospital id must be valid').isMongoId(),
        validateFields
    ],
    createDoctor
);

router.put('/:id',
    [
        validateJWT,
        check('name', 'Doctor name is mandatory').not().isEmpty(),
        check('hospital', 'Hospital id is mandatory').not().isEmpty(),
        check('hospital', 'Hospital id must be valid').isMongoId(),
        validateFields
    ],
    updateDoctor
);

router.delete('/:id', validateJWT, deleteDoctor);

module.exports = router;