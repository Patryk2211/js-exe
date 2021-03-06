const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const TVSeries = require('../models/series');

router.get('/', (req, res, next) => {
    TVSeries.find()
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

router.post('/', checkAuth, (req, res, next) => {
    const series = new TVSeries({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        rating: req.body.rating,
        comment: req.body.comment
    });
    series
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created entry successfully',
                createdSeries: {
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

router.get('/:seriesId', (req, res, next) => {
    const id = req.params.seriesId;
    TVSeries.findById(id)
        .select('title rating comment _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if(doc) {
                res.status(200).json({
                    series: doc,
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

router.patch('/:seriesId', checkAuth, (req, res, next) => {
    const id = req.params.seriesId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    TVSeries.update({_id: id}, { $set: updateOps })
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

router.delete('/:seriesId', checkAuth, (req, res, next) => {
    const id = req.params.seriesId;
    TVSeries.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Entry deleted',
                request: {
                    type: 'POST',
                    description: 'Create a new one!',
                    url: 'http://localhost:3000/movies',
                    body: { title: 'String', rating: 'Number', comment: 'Number' }
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

module.exports = router;