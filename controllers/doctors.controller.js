const { response } = require('express');
const Doctor = require('../models/doctor.model');

const getDoctors = async(req, res = response) => {

    const doctors = await Doctor.find()
                                .populate('author', 'name img')
                                .populate('hospital', 'name img');

    res.json({
        ok: true,
        doctors
    })
}

const createDoctor = async(req, res = response) => {
    const uid = req.uid;
    const doctor = new Doctor({
        author: uid,
        ...req.body
    });

    try {
        const doctorDB = await doctor.save();

        res.json({
            ok: true,
            doctor: doctorDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unhandled Error, check logs...'
        })
    }
}

const updateDoctor = async(req, res = response) => {
    res.json({
        ok: true,
        msg: 'updateDoctor'
    })
}

const deleteDoctor = async(req, res = response) => {
    res.json({
        ok: true,
        msg: 'deleteDoctor'
    })
}


module.exports = {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
}