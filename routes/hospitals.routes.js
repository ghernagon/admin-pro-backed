/*
    Route: /api/hospitals
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt.middleware');
const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitals.controller');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.middleware');


const router = Router();

router.get('/', getHospitals);

router.post('/', 
    [
        validateJWT,
        check('name', 'Hospital name is mandatory').not().isEmpty(),
        validateFields
    ],
    createHospital
);

router.put('/:id',
    [
        validateJWT,
        check('name', 'Hospital name is mandatory').not().isEmpty(),
        validateFields
    ],
    updateHospital
);

router.delete('/:id', validateJWT, deleteHospital);

module.exports = router;