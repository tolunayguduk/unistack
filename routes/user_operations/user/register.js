var express = require('express');
var global_variables = require('../../../global_variables');
var passwordHash = require('password-hash');
var randomstring = require("randomstring");
var db = require('../../model/db');
var nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");
var router = express.Router();

router.post('/', function (req,res) {
    if(req.header("secure")==global_variables.apiKey()){
        var name= req.body.uname;
        var surname = req.body.usurname;
        var email = req.body.uemail;
        var password = req.body.upassword;

        var hashedPassword = passwordHash.generate(password);
        console.log(hashedPassword);

        var activate_Code = randomstring.generate(15);
        var user_type=0;
        if(!name){
            return res.send({code: 400, error:"Kullanıcı adı eksik" });
        }
        if(!surname){
            return res.send({code: 400, error:"Şifre eksik"});
        }
        if(!email){
            return res.send({code: 400, error:"Email eksik"});
        }
        if(!password){
            return res.send({code: 400, error:"Password Eksik"});
        }
        if (!(email.toLowerCase().endsWith(".edu.tr"))){
            return res.send({code: 400, error: "üniversite maili değil."})
        }
        if((email.toLowerCase().search(".ogr"))== -1){
            user_type=1;
        }
        idCrypoo = function (id) {
            var ciphertext = CryptoJS.AES.encrypt(id.toString(),'evren1numara');
            return ciphertext;
        };
//if exist username ?
        db.query("SELECT * FROM users WHERE email=?",[email],function (err,result) {
            if (result.length == 1){
                res.send({code: 400, error:"Bu email daha önceden alınmış"});
            }
            else {
                db.query("INSERT INTO users(name, surname, email, password, user_type, activation_status, activation_code, spam, created_at) VALUES(?,?,?,?,?,?,?,?,NOW())", [name, surname, email, hashedPassword, user_type, 0, activate_Code,0], function (err,result) {
                    if (err){
                        return res.send({code: 400, error:"db hatası"})
                    }
                    else{
                        var user_id = result.insertId;
                        timer(user_id);


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
                        console.log(user_id);
                        var link="http://"+req.get('host')+"/security/accountVerify?id="+activate_Code+"&u="+encodeURIComponent(idCrypoo(user_id).toString());
                        var mailOptions = {
                            from: 'activate@unistackapp.com',
                            to: email,
                            subject: 'Please confirm your Email account',
                            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                return res.send({code: 400, error:"Mail gönderilirken bir hata oluştu..."});
                            } else {
                                db.query("UPDATE users SET spam=? WHERE id=?",[1,user_id],function (err,result) {
                                    if (err){
                                        return res.send({code:400, error:"db hatasııı"});
                                    }
                                    else {
                                        return res.send({code: 200, message:"Mail başarılı bir şekilde gönderildi..."});
                                    }
                                });

                            }
                        });





                    }
                });}
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