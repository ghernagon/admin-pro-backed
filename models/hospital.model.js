const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
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
    }
}, { collection: 'hospitals' }); 
/* NOTE: This define custom collection name,
by default, Mongoose takes the Schema name and add an 'S' at the end when create the collection (this comes for english names),
if we want to define our custom name, just add { collection: 'collection_name' } when creating the mongoose schema
*/

HospitalSchema.method('toJSON', function () {
    // We extract this properties from object, so it will not be sent in response 
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Hospital', HospitalSchema);