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
            console.log(req.session.uid);
            res.render('home', {uid: req.session.uid});
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
            var password = req.body.password;
            if ( !(email && password) ) {
                res.send(lib.genAjaxRet(10001, lib.s('INVALID_EMAIL')));
                clearup();
                return;
            }
            password = encodePassword(password);
            validUser(email, password).then(function(id){
                req.session.uid = id;
                res.send(lib.genAjaxRet(0));
                clearup();
            }, function() {
                var msg = lib.s('LOGIN_FAILED');
                res.send(lib.genAjaxRet(10003, msg));
                clearup();
            });
        },

        register: function(req, res) {
            var email = req.body.email;
            var password = req.body.password;
            if ( !(email && password) ) {
                res.send(lib.genAjaxRet(10001, lib.s('INVALID_EMAIL')));
                res.end();
                clearup();
                return;
            }

            if (password.length < 6 || password.length > 12) {
                res.send(lib.genAjaxRet(10004, lib.s('INVALID_PASSWORD')));
                clearup();
                return;
            }
            var password = encodePassword(req.body.password);

            if (!validEmail(email)) {
                var msg = lib.s('INVALID_EMAIL');
                var ret = lib.genAjaxRet(10002, msg);
                res.send(ret);
                clearup();
                return;
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
            var sql = 'select id, password from user where email = ?';
            mysql.getLine(sql, [email]).then(function(user) {
                if (user['password'] !== password) {
                    reject();
                } else {
                    resolve(user['id']);
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
        if (email.length > 100) {
            return false;
        }
        return email.match(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+$/);
    }

}());

