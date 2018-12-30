const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, require: true},
    rating: { type: Number, require: true},
    comment: { type: String, require: true}
});

module.exports = mongoose.model('Film', filmSchema);