var express = require('express');
var global_variables = require('../global_variables');
var db = require('./model/db');
var router = express.Router();

router.get('/',function (req,res) {
    if(req.header("secure")==global_variables.apiKey()){
        db.query("insert into registeredDevice(registerID,channel,userID) values(?,?,?)",[req.header("registerID"),req.header("channel"),req.header("userID")],function (err,result) {
            if(err){
                res.send(err);
            }
            else{
                res.send({code : 200 , message : "kayıt başarılı"});
            }
        });
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});

module.exports = router;