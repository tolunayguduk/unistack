exports.server_port = function () {return 3000;}
exports.gcm = function () {return "AIzaSyCKewtwH1SVSev5iHJmzm4MWLGevO9i6Ag";}
exports.apiKey = function () {return null;}
exports.db_config = {host : '139.59.157.209', user : 'evren', password : 'Evren123...', database : 'deneme'};



const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'log.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error',level: 'info' } }
});
exports.messageLogger = log4js.getLogger('messageLog');

