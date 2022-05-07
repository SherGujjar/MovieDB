const { register, login, verifyEmail, forgetPassword, resetPassword, logout } = require('../controller/userController');

const express = require('express')();

express.post('/register',register);

express.post('/login',login);

express.get('/verify/email/:token',verifyEmail);

express.post('/password/forget',forgetPassword);

express.put('/password/reset/:token',resetPassword);

express.get('/logout',logout);

module.exports = express;