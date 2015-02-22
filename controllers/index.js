;
(function(){

    var Promise = require('promise');
    var mysql = require(__dirname + '/../core/mysql');
    var lib = require(__dirname + '/../core/lib');
    var connect;

    module.exports.before = function(req, res, next) {
        connect = mysql.connect(__dirname + '/../mysql.json', 'enjoyread');
        next();
    }

    function clearup() {
        connect.destroy();
    }

    module.exports.get = {

        login: function(req, res, next) {
            res.render('login');
        },

        register: function(req, res, next) {
            res.render('register');
        },

        index: function(req, res, next) {
            res.render('home');
        },

        doc: function(req, res, next) {
            res.render('doc');
        },

        about: function(req, res, next) {
            res.render('about');
        },
    };

    module.exports.post = {

        login: function(req, res) {
            var email = req.body.email;
            var password = encodePassword(req.body.password);
            validUser(email, password).then(function(){
                res.send(lib.genAjaxRet(0));
            }, function() {
                var msg = lib.s('LOGIN_FAILED');
                res.send(lib.genAjaxRet(10003, msg));
            });
        },

        register: function(req, res) {
            var email = req.body.email;
            var password = encodePassword(req.body.password);

            if (!validEmail(email)) {
                var msg = lib.s('INVALID_EMAIL');
                var ret = lib.genAjaxRet(10002, msg);
                res.send(ret);
                clearup();
            }

            var sql = 'into user(email, password) value (?, ?)';
            emailAlreadExists(email).then(function() {
                addUser(email, password)
                    .then(function(id) {
                        res.send(res.send(lib.genAjaxRet(0, 'success', id)));
                        clearup();
                    });
            }, function() {
                var msg = lib.s('EMAIL_EXISTS');
                var ret = lib.genAjaxRet(10001, msg);
                res.send(ret);
                clearup();
            });
        }
    };

    function validUser(email, password) {
        return new Promise(function(resolve, reject) {
            var sql = 'select password from user where email = ?';
            mysql.getVar(sql, [email], 'password').then(function(realPassword) {
                if (realPassword !== password) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }

    function encodePassword(password) {
        var sha1 = require('crypto').createHash('sha1');
        return sha1.update(password).digest('hex');
    }

    function emailAlreadExists(email) {
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

    function addUser(email, password) {
        return new Promise(function(resolve, reject) {
            var sql = 'insert into user(email, password) value (?, ?)';
            mysql.runSql(sql, [email, password]).then(function(result) {
                resolve(result.insertId);
            });
        });
    }

    function validEmail(email) {
        return email.match(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+$/);
    }

}());



