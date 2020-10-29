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
    const id = req.params.id; // Hospital id
    const uid = req.uid; // Current User

    try {
        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found'
            });
        }

        const hospitalChange = { ...req.body, author: uid }
        const updatedHospital = await Hospital.findByIdAndUpdate( id, hospitalChange, { new: true } );

        res.json({
            ok: true,
            hospital: updatedHospital
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Call system administrator'
        })
    }
}

const deleteHospital = async(req, res = response) => {
    const id = req.params.id;

    try {
        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found'
            });
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital has been deleted'
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Call system administrator'
        })
    }
}


module.exports = {
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
}