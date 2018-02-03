var express = require('express');
var global_variables = require('../../../global_variables');
var db = require('../../model/db');
var router = express.Router();

router.post('/', function (req, res) {
    if(req.header("secure")==global_variables.apiKey()){
        var userID = req.body.userID;
        var uniCode = req.body.uniCode;
        var unitID = req.body.unitID;
        var facID = req.body.facID;
        var depID = req.body.depID;
        var sinif = req.body.sinif;
        db.query("select uid from university where uniCode=?",[uniCode],function (err,data) {
            if(err){
                res.send({code: 400, message:err});
            }
            else {
                console.log(data[0].uid);
                db.query("INSERT INTO universityinfo (userID, uniID, facID, unitID, depID, sinif) VALUES (?,?,?,?,?,?)",[userID,data[0].uid,facID,unitID,depID,sinif], function (err, result) {
                    if (err){
                        res.send({code: 400, message:err});                }

                    else {
                        res.send({code: 200, message:"kayıt başarılı"});
                    }
                });
            }
        });
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});




module.exports = router;