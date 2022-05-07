const { getAllMovies, getSingleMovie, createMovies, updateMovies, deleteMovies } = require('../controller/movieController');

const express = require('express')();

const {isAuthenticate,authorizeRoles} = require('../middleware/auth')

express.get('/movies',getAllMovies);

express.get('/movies/:id',getSingleMovie);

express.post('/movies',isAuthenticate,authorizeRoles('admin'),createMovies);

express.put('/movies/:id',isAuthenticate,authorizeRoles('admin'),updateMovies);

express.delete('/movies/:id',isAuthenticate,authorizeRoles('admin'),deleteMovies);

module.exports = express;
