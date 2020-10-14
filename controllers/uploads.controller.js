const { response } = require('express')
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/updateImage');

const uploadFile = (req, res = response) => {

    const collectionName = req.params.collectionName;
    const id = req.params.id;

    // Validate type
    const allowedCollections = ['hospitals', 'doctors', 'users'];

    if ( !allowedCollections.includes(collectionName) ) {
        return res.status(400).json({
            ok: false,
            msg: 'Collection is not doctor, hospital or user'
        });
    }

    // Validate file exists
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.'
        });
    }

    // Get Image
    const file = req.files.image;
    const fileName = file.name.split('.');
    const fileExtension = fileName[fileName.length - 1];

    // Validate extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if ( !allowedExtensions.includes(fileExtension) ) {
        return res.status(400).json({
            ok: false,
            msg: 'Not a valid file extension'
        });
    }

    // Generate file name
    const newFileName = `${ uuidv4() }.${ fileExtension }`;

    // Generate save path
    const path = `./uploads/${ collectionName }/${ newFileName }`;

    // Move image to new path
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error moving image'
            });
        }
    });

    // Update DB
    updateImage( collectionName, id, newFileName );

    res.json({
        ok: true,
        msg: 'file upload ok',
        newFileName
    });

}

module.exports = {
    uploadFile
}