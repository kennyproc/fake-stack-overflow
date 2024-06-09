// Answer Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    text: {
        type: String, 
        required: true
    },
    ans_by: {
        type: String, 
        required: true, 
        default: "Anonymous"
    },
    ans_date_time: {
        type: Date, 
        required: true, 
        default: new Date()
    },
    comments: {
        type: Array, 
        required: false, 
        default: []
    }
});

AnswerSchema.virtual('url').get(function() {
    return '/post/answer/' + this._id;
});

module.exports = mongoose.model('Answer', AnswerSchema);