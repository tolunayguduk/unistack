var gcm = require('node-gcm');
var db = require('./db');
var global_variables = require('../../global_variables');
exports.googleCloud = function (msg,gcmID,identity,regId,channel) {


    db.query("select registerID from registeredDevice where registerID != ? and channel = ?",[regId,channel],function (err,result) {
        if(err){console.log(err);}
        else{
            var message = new gcm.Message({
                data: {
                    key1: msg,
                    key2:identity
                }
            });
            var sender = new gcm.Sender(gcmID);
            var registrationTokens = [];
            for(var i=0;i < result.length;i++){
                registrationTokens.push(result[i].registerID);
            }

            sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
                if(err) {
                    console.error(err);
                }
                else{
                    var veri = {"identity" : identity, "gcm" : response, "reg" : registrationTokens}
                    logger = global_variables.messageLogger;
                    logger.info(veri);
                }
            });
        }
    });
}