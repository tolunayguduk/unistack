var express = require('express');
var global_variables = require('../../../global_variables');
var db = require('../../model/db');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/', function (req,res) {
    if(req.header("secure")==global_variables.apiKey()){
        var email = req.body.email;
        var password = req.body.password;

        db.query("SELECT * FROM users WHERE email=?",[email],function (err,result) {
            if(err){
                res.send({code:400,error:"db hatası"});
            }
            else if(result.length==1){
                var hashedPassword = result[0].password;
                var statusPassword = passwordHash.isHashed(hashedPassword);
                var verifyPassword = passwordHash.verify(password,hashedPassword);



                if(verifyPassword== true && statusPassword== true){


                    if(result[0].token){
                        var userType = result[0].user_type;
                        if(userType == 0 ){
                            var activationStatus = result[0].activation_status;
                            if(activationStatus == 0){
                                res.send({code:302, message:"hesap aktif değil ve öğrenci", id : result[0].id});
                            }
                            else if(activationStatus == 1){

                                db.query("SELECT * FROM universityinfo where userID=?", [result[0].id] ,function (err,veri) {
                                    if(err){
                                        res.send({code:400,error:"db hatası"});
                                    }
                                    else if(veri.length==1){
                                        res.send({code:204, message:"login başarılı formu daha önce doldurmuş öğrenci", token : result[0].token , id : result[0].id});
                                    }
                                    else{
                                        res.send({code:203, message:"login başarılı formu daha önce doldurmamış öğrenci", token :  result[0].token,  id : result[0].id});
                                    }
                                });


                            }

                        }
                        else if(userType == 1){
                            var activationStatus = result[0].activation_status;
                            if(activationStatus == 0){
                                res.send({code:301, message:"hesap aktif değil ve hoca", id : result[0].id});
                            }
                            else if(activationStatus == 1){

                                db.query("SELECT * FROM universityinfo where userID=?", [result[0].id] ,function (err,veri) {
                                    if(err){
                                        res.send({code:400,error:"db hatası"});
                                    }
                                    else if(veri.length==1){
                                        res.send({code:204, message:"login başarılı formu daha önce doldurmuş hoca", token :  result[0].token,  id : result[0].id});
                                    }
                                    else{
                                        res.send({code:203, message:"login başarılı formu daha önce doldurmamış hoca", token :  result[0].token,  id : result[0].id});
                                    }
                                });

                            }
                        }
                    }
                    else{

                        var token = jwt.sign({id : result[0].id , name : result[0].name, surname : result[0].surname, email : result[0].email, user_type : result[0].user_type}, 'tolunayguduk');
                        console.log({id : result[0].id , name : result[0].name});
                        db.query('UPDATE users SET token = ? WHERE id= ?', [token,result[0].id],function (err,data) {
                            if (err){
                                res.send({code : 400, message : 'db token ekleme hatası'});
                            }
                        });
                        db.query("SELECT * FROM users WHERE email=?",[email],function (err,result){
                            if(err){
                                res.send({code : 400 , message : 'db hatası'});
                            }
                            else if(result.length==1) {
                                var hashedPassword = result[0].password;
                                var statusPassword = passwordHash.isHashed(hashedPassword);
                                var verifyPassword = passwordHash.verify(password, hashedPassword);
                                if(verifyPassword== true && statusPassword== true) {

                                    var userType = result[0].user_type;
                                    if(userType == 0 ){
                                        var activationStatus = result[0].activation_status;
                                        if(activationStatus == 0){
                                            res.send({code:302, message:"hesap aktif değil ve öğrenci"});
                                        }
                                        else if(activationStatus == 1){

                                            db.query("SELECT * FROM universityinfo where userID=?", [result[0].id] ,function (err,veri) {
                                                if(err){
                                                    res.send({code:400,error:"db hatası"});
                                                }
                                                else if(veri.length==1){
                                                    res.send({code:204, message:"login başarılı formu daha önce doldurmuş öğrenci", token : result[0].token,  id : result[0].id});

                                                }
                                                else{
                                                    res.send({code:203, message:"login başarılı formu daha önce doldurmamış öğrenci", token :  result[0].token,  id : result[0].id});
                                                }
                                            });


                                        }

                                    }
                                    else if(userType == 1){
                                        var activationStatus = result[0].activation_status;
                                        if(activationStatus == 0){
                                            res.send({code:301, message:"hesap aktif değil ve hoca"});
                                        }
                                        else if(activationStatus == 1){

                                            db.query("SELECT * FROM universityinfo where userID=?", [result[0].id] ,function (err,veri) {
                                                if(err){
                                                    res.send({code:400,error:"db hatası"});
                                                }
                                                else if(veri.length==1){
                                                    res.send({code:204, message:"login başarılı formu daha önce doldurmuş hoca", token :  result[0].token,  id : result[0].id});
                                                }
                                                else{
                                                    res.send({code:203, message:"login başarılı formu daha önce doldurmamış hoca", token :  result[0].token,  id : result[0].id});
                                                }
                                            });

                                        }
                                    }

                                }
                            }
                        });

                    }



                }
                else {
                    res.send({code:400, error:"şifre yanlış"});
                }


            }
            else {
                res.send({code:400, error:"bu mailde bir hesap bulunamadı."});
            }
        });
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});

module.exports = router;