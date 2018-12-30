const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Movie = require('../models/movie');

router.get('/', (req, res, next) => {
    Movie.find()
        .select('title rating comment _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                movies: docs.map(doc => {
                    return {
                        title: doc.title,
                        rating: doc.rating,
                        comment: doc.comment,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/movies/' + doc._id
                        }
                    }
                })
            };
            if(docs.length >= 0) {
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'No entries found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const movie = new Movie({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        rating: req.body.rating,
        comment: req.body.comment
    });
    movie
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created entry successfully',
                createdMovie: {
                    title: result.title,
                    rating: result.rating,
                    comment: result.comment,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        URL: 'http://localhost:3000/movies/' + result._id
                    }
                }
            });
      })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:movieId', (req, res, next) => {
    const id = req.params.movieId;
    Movie.findById(id)
        .select('title rating comment _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if(doc) {
                res.status(200).json({
                    movie: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all movies',
                        url: 'http://localhost:3000/movies'
                    }
                });
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.patch('/:movieId', (req, res, next) => {
    const id = req.params.movieId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Movie.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Entry updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/movies' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:movieId', (req, res, next) => {
    const id = req.params.movieId;
    Movie.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;