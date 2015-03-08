;
(function() {

    var mysql = require('mysql');
    var fs = require('fs');
    var util = require('util');
    var Promise = require('promise');
    var _lastConnection;
    var _mysqlConfigFile;
    var _which;

    module.exports.connect = function(mysqlConfigFile, which) {
        _mysqlConfigFile = mysqlConfigFile;
        which = which;
        var config = JSON.parse(fs.readFileSync(mysqlConfigFile).toString());
        if (which) {
            config = config[which];
        }
        var connection = _lastConnection = mysql.createConnection(config);
        return connection;
    }

    module.exports.runSql = function(sql, param, conn) {
        var conn = conn || _lastConnection || connect(_mysqlConfigFile, _which);
        var sql = sqlFilter(sql, param, conn);
        console.log(sql);
        return new Promise(function(resolve, reject){
            conn.query(sql, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        
    }

    module.exports.getLine = function(sql, param, conn) {
        var that = this;
        return new Promise(function(resolve, reject) {
            that.runSql(sql, param, conn).then(function(result){
                if (result.length >= 1) {
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            }, function(err) {
                reject(err);
            });
        });
    }

    module.exports.getVar = function(sql, param, key, conn) {
        var that = this;
        return new Promise(function(resolve, reject) {
            that.runSql(sql, param, conn).then(function(result){
                if (result.length > 0) {
                    resolve(result[0][key]);
                } else {
                    resolve(null);
                }
            }, function(err) {
                reject(err);
            });
        });
    }

    module.exports.getCol = function(sql, param, key, conn) {
        var that = this;
        return new Promise(function(resolve, reject) {
            that.runSql(sql, param, conn).then(function(result){
                var tresult = [];
                for (var i = 0, j = result.length; i < j; i++) {
                    tresult.push(result[i][key]);
                }
                resolve(tresult);
            }, function(err) {
                reject(err);
            });
        });
    }

    function sqlFilter(sql, params, connection) {
        var piece;
        var result = ''; 
        var pieces = sql.split(/(\?)/);
        var i = 0;

        while (piece = pieces.shift()) {
            if (piece === '?') {
                result += connection.escape(params[i]);
                i++;
            } else {
                result += piece;
            }   
        }
        return result;
    }
}());

