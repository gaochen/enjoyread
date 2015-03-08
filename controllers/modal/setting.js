;
(function() {

    var Promise = require('promise');
    var mysql = require(__dirname + '/../../core/mysql');
    var connect = mysql.connect(__dirname + '/../../mysql.json', 'enjoyread');

    var proto = module.exports = function(uid) {
        this.uid = uid;
        this.rss;
        this.pushtime;
        this.oldrss;
    };

    proto.prototype.init = function() {
        var that = this;
        return new Promise(function(resolve, reject) {
            var sql = 'select c.pushtime, group_concat(ur.rid) as rss from config c left join user2rss ur on ur.uid = c.uid where c.uid = ?;';
            mysql.getLine(sql, [that.uid]).then(function(config) {
                that.oldrss = that.rss = config['rss'] ? config['rss'].split(',') : [];
                that.pushtime = config['pushtime'] || '';
                resolve(that);
            }, reject);
        });
    };

    proto.prototype.getUserAll = function() {
        var that = this;
        return new Promise(function(resolve, reject) {
            var sql = 'select rid from user2rss where uid = ?';
            mysql.getCol(sql, [that.uid], 'rid').then(function(userRss) {
                console.log(userRss);
                mysql.runSql('select * from rss').then(function(rss){
                    for (var i = 0, j = rss.length; i < j; i++) {
                        if (rss[i]['id'] in userRss) {
                            rss[i]['ordered'] = 1;
                        } else {
                            rss[i]['ordered'] = 0;
                        }
                    }
                    resolve(rss);
                }, reject);
            }, reject)
        });
    };

    proto.prototype.save = function() {
        var result = _diffRss(this.rss, this.oldrss);
        var esuid = connect.escape(this.uid);
        var sqlAddPart = result.toAdd.map(function(obj){
            var essid = connect.escape(obj);
            return '(' + esuid + ',' + essid + ')';
        });

        var sqlDelPart = result.toDel.map(function(obj){
            return connect.escape(obj);
        });

        var sqlConfig = 'update config set pushtime = ? where uid = ?';
        var sqlAddRss = 'insert into user2rss(uid, rid) values ' + sqlAddPart.join(',');
        var sqlDelRss = 'delete from user2rss where uid = ' + esuid + ' and rid in (' + sqlDelPart.join(',') + ')';
        mysql.runSql(sqlConfig, [this.pushtime, this.uid]);
        sqlAddPart.length !== 0 && mysql.runSql(sqlAddRss);
        sqlDelPart.length !== 0 && mysql.runSql(sqlDelRss);
    };

    function _diffRss(newrss, oldrss) {
        var result = {};
        var filter = function(compare) {
            return function(obj) {
                for (var i = 0, j = compare.length; i < j; i++) {
                    if (obj === compare[i]) return false;
                }
                return true;
            }
        }
        result.toAdd = newrss.filter(filter(oldrss));
        result.toDel = oldrss.filter(filter(newrss));
        return result;
    }

}());
