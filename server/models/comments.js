const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {type: String, required: true, maxlength: 140},
    comment_by: {type: String, required: true, default: "Anonymous"},
    comment_date_time: {type: Date, required: true, default: new Date()}
});

CommentSchema.virtual('url').get(function() {
    return '/post/comment/' + this._id;
});

module.exports = mongoose.model('Comment', CommentSchema);