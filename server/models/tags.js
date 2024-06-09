// Tag Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    name: {type: String, required: true}
});

TagSchema.virtual('url').get(function() {
    return '/post/tag/' + this._id;
});

module.exports = mongoose.model('Tag', TagSchema);