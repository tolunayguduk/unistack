var express = require('express');
var router = express.Router();
//#####################################################################
//#####################################################################
var selectDepartment = require('./universityInfo/selectDepartment');
var selectFaculty = require('./universityInfo/selectFaculty');
var selectUnit = require('./universityInfo/selectUnit');
var submit = require('./universityInfo/submit');
//#####################################################################
//#####################################################################
router.use('/selectDepartment',selectDepartment);
router.use('/selectFaculty',selectFaculty);
router.use('/selectUnit',selectUnit);
router.use('/submit',submit);
//#####################################################################
//#####################################################################
module.exports = router;