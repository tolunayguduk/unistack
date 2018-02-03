var express = require('express');
var db = require('../model/db');
var global_veriables = require("../../global_variables");
var router = express.Router();


router.get('/',function (req,res) {

    if(req.header("secure")==global_veriables.apiKey()){
        rift = req.headers.rift;
        odaListesi = {
            1 : req.headers.oda1,
            2: req.headers.oda2,
            3 : req.headers.oda3,
            4: req.headers.oda4
        }

        altLimit= (rift-1)*50;
        ustLimit = rift*50;
        for(var i = 1; i <= 4; i++){
            db.query('select * from chat where gonderilen = "'+ odaListesi[i] +'" limit '+altLimit+','+ustLimit, function (err,data) {
                if(err){
                    res.send({code:400,message:"db hatası",err});
                    console.log(err);
                }
                else{
                    odaListesi[i] = data;
                    console.log(odaListesi);
                }
            });
        }

        res.send(odaListesi);
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});


module.exports = router;