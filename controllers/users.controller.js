const bcrypt = require('bcryptjs');
const { response } = require('express');
const { genarateJWT } = require('../helpers/jwt');

const User = require('../models/user.model');

const getUsers = async(req, res) => {

    const from = Number(req.query.from) || 0;

    // * Triggering multiple await operations series, could lead to slow performance 
    // const users = await User
    //                     .find({}, 'nombre email role google')
    //                     .skip( from )
    //                     .limit( 5 )

    // const total = await User.count();


    // * Destructuring a promise all is a good choice, it trigger all async operations in parallel and then resolve.
    const [ users, total ] = await Promise.all([
        User
            .find({}, 'nombre email role google')
            .skip( from )
            .limit( 5 ),
            
        User.count()
    ])

    res.json({
        ok: true,
        users,
        total
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

        // Generate JWT
        const token =  await genarateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
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
        
        // v1 - no optimized
        // const fields = req.body;
        // Remove not updatable fields
        // delete fields.password;
        // delete fields.google;

        // v2 - optimized using spread operator
        const { password, google, email, ...fields } = req.body;

        if (userDB.email !== email) {
            const emailAlreadyExist = await User.findOne({ email });
            if (emailAlreadyExist) {
                return res.status(400).json({
                    ok: false,
                    msg: 'That Email is already in use'
                })
            }
        }

        fields.email = email;

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
};


const deleteUser = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist'
            })
        }

        // We should not delete the DB data, we should disable the user instead of delete it        
        await User.findByIdAndDelete( uid );

        return res.json({
            ok: true,
            msg: 'User has been deleted...'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Unhandled error, check logs...'
        })
    }
};

module.exports = { 
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
