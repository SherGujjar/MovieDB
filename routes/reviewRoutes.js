const express = require('express')();

const { getAllReview, getSingleReview, createReview, updateReview, deleteReview, deleteAllReviewOfOne, getAllReviewOfAMovie } = require('../controller/reviewController');
const {isAuthenticate,authorizeRoles} = require('../middleware/auth');

express.get('/review',getAllReview);

express.get('/review/:id',getSingleReview);

express.get('/review/movie/:id',getAllReviewOfAMovie);

express.post('/review',isAuthenticate,createReview);

express.patch('/review/:id',isAuthenticate,updateReview);

express.delete('/review/:id',isAuthenticate,deleteReview);

express.delete('/review/all/:id',isAuthenticate,authorizeRoles('admin'),deleteAllReviewOfOne);

module.exports = express;