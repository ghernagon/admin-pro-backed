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
    const id = req.params.id; // Doctor id
    const uid = req.uid; // Current User

    try {
        const doctorDB = await Doctor.findById(id);

        if (!doctorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Doctor not found'
            });
        }

        const doctorChanges = { ...req.body, author: uid }
        const updatedDoctor = await Doctor.findByIdAndUpdate( id, doctorChanges, { new: true } );

        res.json({
            ok: true,
            doctor: updatedDoctor
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Call system administrator'
        })
    }
}

const deleteDoctor = async(req, res = response) => {
    const id = req.params.id;

    try {
        const doctorDB = await Doctor.findById(id);

        if (!doctorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found'
            });
        }

        await Doctor.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Doctor has been deleted'
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Call system administrator'
        })
    }
}


module.exports = {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
}