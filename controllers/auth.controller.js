const { response } = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { genarateJWT } = require('../helpers/jwt');

const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // Check Email
        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Username or password did not match'
            })
        }

        // Check Password
        const validPassword = bcrypt.compareSync( password, userDB.password );

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Username or password did not match'
            })
        }

        // Generate JWT
        const token =  await genarateJWT(userDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unhandled error, check logs...'
        })
    }
}


module.exports = {
    login
}