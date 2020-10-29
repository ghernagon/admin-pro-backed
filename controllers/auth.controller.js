const { response } = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { genarateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res = response) => {
    const googleToken = req.body.token;
    try {
        const { name, email, picture } = await googleVerify(googleToken);

        // Check if email already exist
        const userDB = await User.findOne({ email });
        let user;

        if (!userDB) {
            user = new User({
                name,
                email,
                img: picture,
                password: '@@@',
                google: true
            })
        } else {
            user = userDB;
            user.google =  true;
            user.password = '@@@'
        }

        // Save DB
        await user.save();

        // Generate JWT
        const token =  await genarateJWT(user.id);

        res.json({
            ok: true,
            token
        })
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        })
    }
}

const refreshToken = async(req, res = response) => {
    const uid = req.uid;
    // Generate JWT
    const token =  await genarateJWT(uid);
    res.json({
        ok: true,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    refreshToken
}