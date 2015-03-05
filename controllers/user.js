;
(function(){

    var Promise = require('promise');
    var mysql = require(__dirname + '/../core/mysql');
    var lib = require(__dirname + '/../core/lib');

    module.exports.before = function(req, res, next) {
        connect = mysql.connect(__dirname + '/../mysql.json', 'enjoyread');
        if (!req.session.uid) {
            var message = lib.genAjaxRet(10001, lib.s('ACCESS_DENY'));
            req.end(message);
        }
        next();
    }

}());
