const mongoose = require('mongoose');

const series = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, require: true},
    rating: { type: Number, require: true},
    comment: { type: String, require: true}
});

module.exports = mongoose.model('Series', series);