var express = require('express');
var global_variables = require('../../../global_variables');
var db = require('../../model/db');
var url = require('url');
var CryptoJS = require("crypto-js");
var randomstring = require("randomstring");
var router = express.Router();

router.get('/', function (req,res) {
    if(req.header("secure")==global_variables.apiKey()){
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var q = url.parse(fullUrl,true);
        var data = q.query;
        var id = data.id;
        var uid =decodeURIComponent(data.u);


        console.log(typeof uid);
        console.log(decodeURIComponent(uid));
        var bytes  = CryptoJS.AES.decrypt(uid, 'evren1numara');
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        console.log(plaintext);
        db.query("SELECT activation_status,activation_code FROM users WHERE id =?",[plaintext],function (err,result) {
            if (err){

                return res.send({code: 400, message:" db hatası bro"});
            }
            else if(result.length==0){
                res.end("<h1>HESAP BULUNAMADI...</h1>");
            }
            else {
                console.log(result);
                var activation_status =  result[0].activation_status;


                if (activation_status == 1){
                    res.end("<h1>HESABINIZ SUANDA AKTiF HALDE...</h1>");
                }
                else {
                    db.query("SELECT * FROM users WHERE activation_code=? and id=?",[id,plaintext],function (err,result) {
                        if (err){

                            return res.send({code: 400, message:" db hatası bro"});
                        }
                        else if(result.length==1)
                        {   var newactivation_code = randomstring.generate(15);
                            console.log(newactivation_code);
                            db.query("UPDATE users SET activation_status=?, activation_code=? WHERE id=?",[1,newactivation_code,plaintext],function (err,result) {
                                if (err){
                                    return res.send({code: 400, message:"db sıçmış bro"});
                                }
                                else {
                                    res.end("<h1>HESABiNiZ AKTiF EDiLDi...</h1>");
                                }
                            });
                        }
                        else
                        {
                            res.end("<h1>HESABINIZ AKTiF EDiLEMEDi...</h1>");
                        }
                    })
                }
            }
        });
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});



module.exports = router;
