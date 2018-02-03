var express = require('express');
var global_variables = require('../../../global_variables');
var db = require('../../model/db');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var router = express.Router();

router.post('/', function (req,res) {
    if(req.header("secure")==global_variables.apiKey()){
        var email = req.body.email;
        var token = randomstring.generate(15);



        dataInsert = function (id,new_password) {
            console.log(new_password);
            console.log(token);
            console.log(id);
            db.query("INSERT INTO change_password(eposta, user_id, new_password, spam, token, created_at) VALUES(?,?,?,?,?,NOW())",[email, id, new_password, 1, token],function (err,result) {
                if (err){
                    return res.send({code: 400, message: "db hatası kardes"});
                }
                else {
                    db.query("UPDATE users SET password=? WHERE id=?",[new_password,id],function (err,result) {
                        if (err){
                            return res.send({code: 400, message: "db hatası kardes"});
                        }
                        else{
                            console.log("dbde şifre güncellendi...")
                        }
                    });
                    console.log("kayıt başarılı...");
                }

            });
        };




        mailSend = function(id,new_password){
            var transporter = nodemailer.createTransport({
                service: 'yandex',
                host: 'smtp.yandex.com.tr',
                port: 465,
                secure: true,
                auth: {
                    user: 'activate@unistackapp.com',
                    pass: '123654...'
                }
            });

            var mailOptions = {
                from: 'activate@unistackapp.com',
                to: email,
                subject: 'Please confirm your Email account',
                html : "Hello,<br> Geçici Şifreniz:  .<br>"+new_password
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    return res.send({code: 400, error:"Mail gönderilirken bir hata oluştu..."});
                } else {
                    var hashedPassword = passwordHash.generate(new_password);
                    console.log(hashedPassword);
                    dataInsert(id,hashedPassword);
                    console.log(token);
                    timer(token);
                    return res.send({code: 200, message:"Mail başarılı bir şekilde gönderildi..."});
                }
            });
        };

        spamControl =function (id,new_pass) {
            db.query("SELECT spam FROM change_password WHERE eposta=?",[email],function (err,result) {
                if(result.length==0){
                    mailSend(id,new_pass);
                }
                else if(result.length>=1) {
                    var index = (result.length)-1;
                    console.log(index);
                    var spam = result[index].spam;
                    console.log(spam);
                    console.log(result);
                    if (err){
                        return res.send({code: 400, message: "db hatası kardes"});
                    }
                    else if(spam==1){
                        return res.send({code: 400, message: "Mail gönderildi...mail gelmedi ise 5 dakika sonra tekrar deneyin"})
                    }
                    else {

                        mailSend(id,new_pass);

                    }

                }
            });
        };

        //Get id from database
        db.query("SELECT * FROM users WHERE email=?",[email],function (err,result) {
            if (err){
                return res.send({code: 400, message: "db hatası kardes"});
            }
            else if (result.length == 1){
                db.query("SELECT id FROM users WHERE email=?",[email],function (err,result)  {
                    var string=JSON.stringify(result);
                    var json =  JSON.parse(string);
                    var id = (json[0].id).toString();
                    var new_password = randomstring.generate(6);
                    console.log(new_password);
                    spamControl(id,new_password);
                });
            }
            else {
                return res.send({code: 400, message:"kullanıcı kaydı bulunamadı"})
            }
        });

        timer = function (id) {

            setTimeout(function () {
                var newactivation_code = randomstring.generate(15);
                console.log(newactivation_code);
                db.query("UPDATE users SET activation_code=?,spam=? WHERE id=?",[newactivation_code,0,id],function (err,result) {                 if (err){
                    return res.send({code:400, error:"db hatasııı"});
                }
                else {
                    console.log("code patates");
                }
                });
            }, 300000)
        };
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});

module.exports = router;