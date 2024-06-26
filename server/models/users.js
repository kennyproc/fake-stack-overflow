const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        username: {type: String, required: true},
        passwordHash: {type: String, required: true},
        email: {type: String, required: true}
    },
    {timestamps: true}
)

module.exports = mongoose.model('User', UserSchema)