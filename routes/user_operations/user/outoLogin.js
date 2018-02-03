var express = require('express');
var global_variables = require('../../../global_variables');
var db = require('../../model/db');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/', ensureToken, function (req,res) {
    if(req.header("secure")==global_variables.apiKey()){
        jwt.verify(req.token, 'tolunayguduk', function(err, data) {
            if (err) {
                res.send(err);
            } else {
                db.query("select * from universityinfo where userID=?",[data.id], function (err,result) {
                    if(err){
                        res.send({code:400,error:"db hatası",error:err});
                    }
                    else{

                        sql = "SELECT university.uniCode,units.unitName,faculty.fakulte,department.depName,universityinfo.sinif";
                        sql += " FROM universityinfo";
                        sql += " INNER JOIN university ON universityinfo.uniID = university.uid";
                        sql += " INNER JOIN units ON universityinfo.unitID = units.unitID";
                        sql += " INNER JOIN faculty ON universityinfo.facID = faculty.fid";
                        sql += " INNER JOIN department ON universityinfo.depID = department.depID";
                        sql += " INNER JOIN users ON universityinfo.userID = ?";


                        db.query(sql, [data.id], function (err, result2) {
                            if(err){
                                res.send({code:400,error:"db hatası",error:err});
                            }
                            else{

                                veriler={
                                    id: data.id,
                                    name:data.name,
                                    surname:data.surname,
                                    email:data.email,
                                    userType:data.user_type,
                                    uniID:result[0].uniID,
                                    uniCode:result2[0].uniCode,
                                    facID:result[0].facID,
                                    facName:result2[0].fakulte,
                                    unitID:result[0].unitID,
                                    unitName:result2[0].unitName,
                                    depID:result[0].depID,
                                    depName:result2[0].depName,
                                    sinif:result[0].sinif
                                }
                                res.send(veriler);
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});
function ensureToken(req, res, next) {
    const bearerHeader = req.header("token");
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}
module.exports = router;