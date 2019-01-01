const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    year: { type: Number }
});

module.exports = mongoose.model('Post', postSchema);