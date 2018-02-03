var express = require('express');
var path = require("path");
var nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
var global_variables = require('../../../global_variables');
var db = require('../../model/db');
var router = express.Router();

router.use(fileUpload());


router.post('/imageUpload', function (req,res) {
   if(req.header("secure")==global_variables.apiKey()){
       if (!req.files)
           return res.status(400).send('Hiçbir Dosya Yüklenmedi...');
       var sampleFile = req.files.sampleFile;
       sampleFile.mv(__dirname + '/../../../public/img/'+ req.body.user + Date.now() + '.jpg', function(err) {
           if (err)
               return res.status(500).send(err);
           res.send('Resim Yüklendi...!');
       });
   }
   else {
       res.send({code : 401, message : "Access Denied..."});
   }

});
router.post('/changeName', function (req, res) {
    name = req.body.name;
    surname = req.body.surname;
    userID = req.body.userID;
    if(req.header("secure")==global_variables.apiKey()){
        if(name != "" && surname != ""){
            db.query("UPDATE users SET name = ?, surname = ? WHERE id= ?", [name, surname, userID], function (err,data) {
                if(err){
                    res.send({code:400,error:"db hatası",error:err});
                }else{
                    res.send({code:200, message:'kullanici adi degistirildi'});
                }
            })
        }
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }

});
router.get('/deleteAccount', function (req, res) {
    if(req.header("secure")==global_variables.apiKey()){
        db.query("update users set activation_status = 0 where email = ?",[req.header("usermail")],function (err,data) {
            if(err){
                res.send({code : 400, message : "işlem gerçekleştirilemedi..."});
            }
            else{
                res.send({code : 200 , message : "işlme gerçekleştirildi..."});
            }
        });
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});
router.post('/feedback', function (req,res) {
    if(req.header("secure")==global_variables.apiKey()){
        var transporter = nodemailer.createTransport({
            service: 'yandex',
            host: 'smtp.yandex.com.tr',
            port: 465,
            secure: true,
            auth: {
                user: 'info@unistackapp.com',
                pass: '123654...'
            }
        });
        var mailOptions = {
            from: 'info@unistackapp.com',
            to: 'info@unistackapp.com',
            subject: 'FEEDBACK FROM '+ req.body.email,
            html : req.body.message
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.send({code: 400, error : error});
            } else {
                res.send({code : 200, message : info});
            }
        });
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});


module.exports = router;