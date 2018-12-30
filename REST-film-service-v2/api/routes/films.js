const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Film = require('../models/film');
//dziaaj
router.get('/', (req, res, next) => {
    Film.find()
        .select('title rating comment _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                films: docs
            };
            if(docs.length >= 0) {
                res.status(200).json(docs);
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
    const film = new Film({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        rating: req.body.rating,
        comment: req.body.comment
    });
    film
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requets to /films',
                createdFilm: result
            });
      })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:filmId', (req, res, next) => {
    const id = req.params.filmId;
    Film.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if(doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.patch('/:filmId', (req, res, next) => {
    const id = req.params.filmId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Film.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:filmId', (req, res, next) => {
    const id = req.params.filmId;
    Film.remove({_id: id})
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