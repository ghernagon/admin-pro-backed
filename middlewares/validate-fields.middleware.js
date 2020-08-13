const { response } = require('express');
const { validationResult } = require('express-validator');

/**
 * Creates a middleware to validate if request doesn't contain errors
 * comming from routes check validators;
 * If it doesn't contain any error, then continue to route controller
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const validateFields = (req, res = response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    }

    next();
}

module.exports = {
    validateFields
}