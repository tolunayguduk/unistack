var express = require('express');
var global_variables = require('../../../global_variables');
var db = require('../../model/db');
var router = express.Router();

router.get('/', ensureToken, function (req,res) {
    if(req.header("secure")==global_variables.apiKey()){
        console.log(req.token);
        jwt.verify(req.token, 'tolunayguduk', function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    }
    else {
        res.send({code : 401, message : "Access Denied..."});
    }
});
function ensureToken(req, res, next) {
    if(req.header("secure")==global_variables.apiKey()){
        const bearerHeader = req.headers.authorization;
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            console.log(bearer);
            req.token = bearerToken;
            next();
        } else {
            res.sendStatus(403);
        }
    }
    else{
        res.send({code : 401, message : "Access Denied..."});
    }

}


module.exports = router;
