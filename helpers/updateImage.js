const fs = require('fs');

const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');


const deleteImage = (path) => {
    if ( fs.existsSync( path ) ) {
        // Delete previous image
        fs.unlinkSync( path );
    }
}

const updateImage = async( collectionName, id, newFileName ) => {

    let oldPath = '';

    switch ( collectionName ) {
        case 'doctors':
            const doctor = await Doctor.findById(id);
            if ( !doctor ) {
                return false;
            }

            oldPath = `./uploads/doctors/${ doctor.img }`;
            deleteImage(oldPath);

            doctor.img = newFileName;
            await doctor.save();
            return true;
        break;
        case 'hospitals':
            const hospital = await Hospital.findById(id);
            if ( !hospital ) {
                return false;
            }

            oldPath = `./uploads/hospitals/${ hospital.img }`;
            deleteImage(oldPath);

            hospital.img = newFileName;
            await hospital.save();
            return true;
        break;
        case 'users':
            const user = await User.findById(id);
            if ( !user ) {
                return false;
            }

            oldPath = `./uploads/users/${ user.img }`;
            deleteImage(oldPath);

            user.img = newFileName;
            await user.save();
            return true;
        break;
        default:
        break;
    }    

}

module.exports = {
    updateImage
}