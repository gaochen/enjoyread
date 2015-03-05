;
(function() {
    var Promise = require('promise');
    var mysql = require(__dirname + '/../../core/mysql');
    var connect = mysql.connect(__dirname + '/../../mysql.json', 'enjoyread');;

    var proto = module.exports = function(email, password) {
        this.email = email;
        this.password = password;
    }

    proto.prototype.save = function() {
        return new Promise(function(resolve, reject) {
            mysql.runSql('insert into user(email, password) values (?, ?)', [this.email, this.password])
                .then(resolve, reject);
        });
    }

    proto.prototype.get = function(id) {
        var that = this;
        return new Promise(function(resolve, reject) {
            mysql.getLine('select * from user where id = ?', [id])
                .then(function(result) {
                    if (!result || result.length === 0) {
                        reject('No such user');
                        return;
                    }
                    that.email = result['email'];
                    that.password = result['password'];
                    resolve(that);
                }, reject)
        });
    }

    proto.addUser = function(email, password) {
        return new Promise(function(resolve, reject) {
            var sql = 'insert into user(email, password) value (?, ?)';
            mysql.runSql(sql, [email, password]).then(function(result) {
                resolve(result.insertId);
            });
        });
    }

    proto.validEmail = function(email) {
        if (email.length > 100) {
            return false;
        }
        return email.match(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+$/);
    }

    proto.validUser = function(email, password) {
        return new Promise(function(resolve, reject) {
            var sql = 'select id, password from user where email = ?';
            mysql.getLine(sql, [email]).then(function(user) {
                if (user === null || user['password'] !== password) {
                    reject();
                } else {
                    resolve(user['id']);
                }
            });
        });
    }

    proto.emailAlreadyExists = function(email) {
        return new Promise(function(resolve, reject) {
            var sql = 'select email from user where email = ?';
            mysql.runSql(sql, [email]).then(function(result) {
                if (result.length !== 0) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }

    proto.encodePassword = function(password) {
        var sha1 = require('crypto').createHash('sha1');
        return sha1.update(password).digest('hex');
    }
}());
