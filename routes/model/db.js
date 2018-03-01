var mysql = require('mysql');
var global_variables = require('../../global_variables');

var connection;
connection = mysql.createConnection(global_variables.db_config);
connection.connect(function (err) {
if (err){
console.log('Database connection error:',err);
}
else
console.log('... SQL CONNECTED ...');

});
module.exports = connection;
