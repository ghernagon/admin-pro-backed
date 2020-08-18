const { response } = require('express');
const Hospital = require('../models/hospital.model');

const getHospitals = async(req, res = response) => {

    const hospitals = await Hospital.find().populate('author', 'name img');

    res.json({
        ok: true,
        hospitals
    })
}

const createHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        author: uid,
        ...req.body
    });

    try {
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unhandled Error, check logs...'
        })
    }

}

const updateHospital = async(req, res = response) => {
    res.json({
        ok: true,
        msg: 'updateHospital'
    })
}

const deleteHospital = async(req, res = response) => {
    res.json({
        ok: true,
        msg: 'deleteHospital'
    })
}


module.exports = {
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
}