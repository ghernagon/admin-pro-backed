const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

const getUsers = async(req, res) => {
    const users = await User.find({}, 'nombre email role google');

    res.json({
        ok: true,
        users
    });
};

const createUser = async(req, res = response) => {
    const { password, email } = req.body;
    
    try {
        const emailAlreadyExist = await User.findOne({ email });

        if (emailAlreadyExist) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already exist'
            })
        }

        const user = new User( req.body );

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        res.json({
            ok: true,
            user
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Unhandled error, check logs...'
        })
    }
};

const updateUser = async(req, res = response) => {
    // TODO: Validate token and check if has permission

    const uid = req.params.id;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist'
            })
        }
        
        // Update User
        const fields = req.body;

        // Check if user try to replace email
        if (userDB.email === req.body.email) {
            delete fields.email;
        } else {
            // Check if new email already exist in db
            const emailAlreadyExist = await User.findOne({ email: req.body.email });
            if (emailAlreadyExist) {
                return res.status(400).json({
                    ok: false,
                    msg: 'That Email is already in use'
                })
            }
        }

        // Remove not updatable fields
        delete fields.password;
        delete fields.google;

        // { new: true } tell mongoose we want to return the updated data instead of current data (got by find)
        const updatedUser = await User.findByIdAndUpdate(uid, fields, { new: true });
        
        res.json({
            ok: true,
            user: updatedUser
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Unhandled error, check logs...'
        })
    }
}


module.exports = { 
    getUsers,
    createUser,
    updateUser
};
