var express = require('express');
var router = express.Router();
//#####################################################################
//#####################################################################
var accountVerify = require('./security/accountVerify');
var accountVerifyAgain = require('./security/accountVerifyAgain');
var tokenControl = require('./security/tokenControl');
//#####################################################################
//#####################################################################
router.use('/accountVerify',accountVerify);
router.use('/accountVerifyAgain',accountVerifyAgain);
router.use('/tokenControl',tokenControl);
//#####################################################################
//#####################################################################
module.exports = router;
