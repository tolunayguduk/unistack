var randomstring = require("randomstring");
var db = require('./db');
exports.delay = function (id,delay) {
    setTimeout(function () {
        var newactivation_code = randomstring.generate(15);
        console.log(newactivation_code);
        db.query("UPDATE users SET activation_code=?,spam=? WHERE id=?",[newactivation_code,1,id],function (err,result) {
        if (err){
            return res.send({code:400, error:"db hatasııı"});
        }
        else {
            console.log("code patates"+err);
        }
        });
    }, delay);
}


