const express = require('express')();

const { createGroup, AddMovieToAList, deleteMovieFromAList, getWishList, usersList } = require('../controller/wishListControler');
const{authorizeRoles,isAuthenticate} = require('../middleware/auth')


express.post('/wishlistgroup',isAuthenticate,createGroup);

express.get('/wishlistgroup/me',isAuthenticate,usersList);

express.put('/wishlistgroup/add/:id',isAuthenticate,AddMovieToAList);

express.delete('/wishlistgroup/delete/:id',isAuthenticate,deleteMovieFromAList);

express.get('/wishlistgroup/:id',isAuthenticate,getWishList);



module.exports = express;