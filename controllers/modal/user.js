;
(function() {
    var Promise = require('promise');
    var mysql = require(__dirname + '/../../core/mysql');
    var connect = mysql.connect(__dirname + '/../../mysql.json', 'enjoyread');

    var proto = module.exports = function(id, email, password) {
        this.email = email;
        this.password = password;
        this.id = id;
        var that = this;
        proto.emailAlreadyExists(email).then(function(result){
            that._exist = result;
        })
    }

    proto.prototype.save = function() {
        var that = this;
        function _update(resolve,reject){
            mysql.runSql('update user set password = ? where email = ?', [that.password, that.email])
                .then(function(){
                    resolve('update success');
                }, reject);
        }
        function _insert(resolve,reject){
            mysql.runSql('insert into user(email, password) values (?, ?)', [that.email, that.password])
                .then(function(){
                    resolve('insert success');
                },reject);
        }
        return new Promise(function(resolve, reject) {
            switch(true){
                case that._exist === undefined:
                    proto.emailAlreadyExists(that.email)
                        .then(function(result){
                            if(result){
                                _update(resolve,reject);
                            }else{
                                _insert(resolve,reject);
                            }
                        }, reject);
                    break;
                case that._exist === true:_update(resolve,reject);break;
                case that._exist === false:_insert(resolve,reject);break;
            }
        });
    }

    proto.prototype.get = function() {
        var that = this;
        return new Promise(function(resolve, reject) {
            mysql.getLine('select * from user where id = ?', [that.id])
                .then(function(result) {
                    if (!result || result.length === 0) {
                        resolve('No such user');
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
            proto.emailAlreadyExists(email).then(function(result){
                if(result){
                    resolve('the email is exist');
                }else{
                    mysql.runSql(sql, [email, password])
                        .then(function(result) {
                            resolve(result.insertId);
                        }, reject);
                }
            }, reject);
        });
    }

    proto.validEmail = function(email) {
        if (email.length > 100) {
            return false;
        }
        return email.match(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+$/);
    }

    proto.prototype.changePassword = function(password) {
        var that = this;
        return new Promise(function(resolve, reject) {
            var sql = 'update user set password = ? where id = ?';
            mysql.runSql(sql, [that.encodePassword(password), that.id]).then(function(result) {
                resolve(result);
            }, reject);
        });
    }

    proto.validUser = function(email, password) {
        return new Promise(function(resolve, reject) {
            var sql = 'select id, password from user where email = ?';
            mysql.getLine(sql, [email]).then(function(user) {
                if (user === null || user['password'] !== proto.prototype.encodePassword(password)) {
                    resolve('email or password is wrong');
                } else {
                    resolve(user['id']);
                }
            }, reject);
        });
    }

    proto.emailAlreadyExists = function(email) {
        return new Promise(function(resolve, reject) {
            var sql = 'select email from user where email = ?';
            mysql.runSql(sql, [email]).then(function(result) {
                if (result.length !== 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, reject);
        });
    }

    proto.prototype.encodePassword = function(password) {
        var sha1 = require('crypto').createHash('sha1');
        return sha1.update(password).digest('hex')
    }
}());
