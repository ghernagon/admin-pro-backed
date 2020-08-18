const { response } = require('express');
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');

const getSearch = async(req, res = response) => {

    const term = req.params.term;
    const regex = new RegExp( term, 'i' ); // Case insensitive

    // Search for users
    // const usersResult = await User.find({ name: regex });

    const [ usersResult, doctorResult, hospitalResult ] = await Promise.all([
        User.find({ name: regex }),
        Doctor.find({ name: regex }),
        Hospital.find({ name: regex }),
    ])

    res.json({
        ok: true,
        users: usersResult,
        doctors: doctorResult,
        hospitals: hospitalResult
    })
}

const getSearchByCollection = async(req, res = response) => {
    const collection = req.params.table;
    const term = req.params.term;
    const regex = new RegExp( term, 'i' ); // Case insensitive

    let data = [];

    switch (collection) {
        case 'doctors':
            data = await Doctor.find({ name: regex })
                                .populate('author', 'name img')
                                .populate('hospital', 'name img');
            break;
        case 'hospitals':
            data = await Hospital.find({ name: regex })
                                 .populate('author', 'name img');
            break;
        case 'users':
            data = await User.find({ name: regex });
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'The available collections are Doctors / Hospitals / Users'
            })
            break;
    }

    res.json({
        ok: true,
        result: data
    })
}

module.exports = {
    getSearch,
    getSearchByCollection
}