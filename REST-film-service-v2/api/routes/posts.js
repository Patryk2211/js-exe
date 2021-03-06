const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Post = require('../models/post');
const Movie = require('../models/movie');

router.get('/', (req, res, next) => {
    Post.find()
        .select('movie year _id')
        .populate('movie', 'title')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                posts: docs.map(doc => {
                    return {
                        _id: doc._id,
                        movie: doc.movie,
                        year: doc.year,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/posts/' + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

router.post('/', checkAuth, (req, res, next) => {
    Movie.findById(req.body.movieId)
        .then(movie => {
            if(!movie) {
               return res.status(404).json({
                    message: "Movie not found"
                });
            }
            const post = new Post({
                _id: mongoose.Types.ObjectId(),
                year: req.body.year,
                movie: req.body.movieId
            });
            return post.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Post stored',
                createdPost: {
                    _id: result._id,
                    movie: result.movie,
                    year: result.year
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/posts/' + result._id
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

router.get('/:postId', (req, res, next) => {
    Post.findById(req.params.postId)
    .populate('movie')
    .exec()
    .then(post => {
            if (!post) {
                return res.status(404).json({
                    message: 'Post not found'
                });
            }
        res.status(200).json({
            post: post,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/posts'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

});

router.delete('/:postId', checkAuth, (req, res, next) => {
    Post.remove({ _id: req.params.postId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders',
                    body: { movieId: 'ID', year: 'NUMBER' }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;