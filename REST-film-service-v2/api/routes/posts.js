const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Posts were fetched'
    });
});

router.post('/', (req, res, next) => {
    const post = {
        postId: req.body.postId,
        description: req.body.description
    };
    res.status(201).json({
        message: 'Post was created',
        post: post
    });
});

router.get('/:postId', (req, res, next) => {
    res.status(200).json({
        message: 'Post details',
        postId: req.params.postId
    });
});

router.delete('/:postId', (req, res, next) => {
    res.status(200).json({
        message: 'Post deleted',
        postId: req.params.postId
    });
});


module.exports = router;