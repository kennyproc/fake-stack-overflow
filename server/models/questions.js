// Question Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title: {type: String, required: true, maxLength: 50},
    summary: {type: String, required: true, maxlength: 140},
    text: {type: String, required: true},
    tags: {type: Array, required: true},
    answers: {type: Array, required: false},
    asked_by: {type: String, required: true, default: "Anonymous"},
    ask_date_time: {type: Date, required: true, default: new Date()},
    views: {type: Number, required: true, default: 0},
    comments: {type: Array, required: false, default: []}
});

QuestionSchema.virtual('url').get(function() {
    return '/post/question/' + this._id;
});

module.exports = mongoose.model('Question', QuestionSchema);