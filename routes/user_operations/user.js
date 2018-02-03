var express = require('express');
var router = express.Router();
//#####################################################################
var register = require('./user/register');
var forgotPassword = require('./user/forgotPassword');
var login = require('./user/login');
var outoLogin = require('./user/outoLogin');
var profile = require('./user/profile');
//#####################################################################
//#####################################################################
router.use('/profile',profile);
router.use('/register',register);
router.use('/forgotPassword',forgotPassword);
router.use('/login',login);
router.use('/outoLogin',outoLogin);
//#####################################################################
module.exports = router;
