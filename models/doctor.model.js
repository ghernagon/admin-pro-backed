const { Schema, model } = require('mongoose');

const DoctorSchema = Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    author: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    hospital: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }
}); 

DoctorSchema.method('toJSON', function () {
    // We extract this properties from object, so it will not be sent in response 
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Doctor', DoctorSchema);