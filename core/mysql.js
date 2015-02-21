;
(function() {

    var mysql = require('mysql');
    var fs = require('fs');
    var util = require('util');
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

    module.exports.getData = function(callback, sql, params, conn) {
        var conn = conn || _lastConnection || connect(_mysqlConfigFile, _which);
        sql = sqlFilter(sql, params, conn);
        conn.query(sql, function(err, result) {
            callback(err, result);
        });
    }

    module.exports.runSql = function(sql, param, conn) {
        var conn = conn || _lastConnection || connect(_mysqlConfigFile, _which);
        var sql = sqlFilter(sql, param, conn);
    }

    module.exports.getLine = function(sql, param, conn) {
        var conn = conn || _lastConnection || connect(_mysqlConfigFile, _which);
        var sql = sqlFilter(sql, param, conn);
    }

    module.exports.getCol = function(sql, param, conn) {
        var conn = conn || _lastConnection || connect(_mysqlConfigFile, _which);
        var sql = sqlFilter(sql, param, conn);
    }

    function sqlFilter(sql, params, connection) {
        var piece;
        var result = ''; 
        var pieces = sql.split(/(%s|%i)/);
        var i = 0;

        while (piece = pieces.shift()) {
            if (piece === '%s') {
                result += "'" + connection.escape(params[i]) + "'";
                i++;
            }   
            else if (piece === '%i') {
                result += connection.escape(params[i]);
                i++;
            } else {
                result += piece;
            }   
        }   
        return result;
    }
}());

