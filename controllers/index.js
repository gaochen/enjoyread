;
(function(){

    var Promise = require('promise');
    var mysql = require(__dirname + '/../core/mysql');
    var lib = require(__dirname + '/../core/lib');
    var User = require(__dirname + '/modal/user');
    var Setting = require(__dirname + '/modal/setting');

    module.exports.before = function(req, res, next) {
        next();
    }

    module.exports.get = {

        login: function(req, res) {
            res.render('login');
        },

        register: function(req, res) {
            res.render('register');
        },

        index: function(req, res) {
            res.render('home', {uid: req.session.uid});
        },

        doc: function(req, res) {
            res.render('doc');
        },

        about: function(req, res) {
            res.render('about');
        },

        logout: function(req, res) {
            req.session.destroy();
            res.send('success');
        },

        quickstart: function(req, res) {
            res.render('quickstart');
        },

        setting: function(req, res) {
            res.render('setting');
        },

        rss: function(req, res) {
            mysql.runSql('select id, name, picture from rss where type = "OFFICAL"').then(function(result) {
                res.send(JSON.stringify(result));
            }, function(err) {
                console.log(err);
            });
        }
    };

    module.exports.post = {

        setting: function(req, res) {
            var rss = req.body.rss;
            var pushtime = req.body.pushtime;
            var setting = new Setting(uid);
                setting.init().then(function() {
                setting.rss = rss;
                setting.pushtime = pushtime;
                setting.save();
                res.send('success')  ;
            });
        },

        emailexists: function(req, res) {
            var email = req.body.email;
            User.emailAlreadyExists(email).then(
                function(result) {
                    if(!result){
                        res.send(lib.genAjaxRet(0));
                    }else{
                        res.send(lib.genAjaxRet(10001, lib.s('EMAIL_EXISTS')));
                    }
                },function(err){
                    handleErr(res,err);
                });
        },

        quickstart: function(req, res) {
            var email = req.body.email;
            var rss = req.body.rss;
            User.addUser(email, '123456').then(function(uid) {
                var setting = new Setting(uid);
                setting.init().then(function() {
                    setting.rss = rss;
                    setting.save();
                    res.send('success');
                }, function(err) {
                    console.log(err);
                });
            }, function(err) {
                console.log(err);
            });
        },

        login: function(req, res) {
            var email = req.body.email;
            var password = req.body.password;
            if ( !(email && password) ) {
                res.send(lib.genAjaxRet(10001, lib.s('INVALID_EMAIL')));
                return;
            }
            password = User.encodePassword(password);
            User.validUser(email, password).then(function(result){
                if(typeof result === 'number'){
                    req.session.uid = id;
                    res.send(lib.genAjaxRet(0));
                }else if(result === 'email or password is wrong'){
                    var msg = lib.s('LOGIN_FAILED');
                    res.send(lib.genAjaxRet(10003, msg));
                }
            }, function(err) {
                handleErr(res,err);
            });
        },

        register: function(req, res) {
            var email = req.body.email;
            var password = req.body.password;
            if ( !(email && password) ) {
                res.send(lib.genAjaxRet(10001, lib.s('INVALID_EMAIL')));
                return;
            }

            if (password.length < 6 || password.length > 12) {
                res.send(lib.genAjaxRet(10004, lib.s('INVALID_PASSWORD')));
                return;
            }
            var password = User.encodePassword(req.body.password);

            if (!User.validEmail(email)) {
                var msg = lib.s('INVALID_EMAIL');
                var ret = lib.genAjaxRet(10002, msg);
                res.send(ret);
                return;
            }

            User.emailAlreadyExists(email).then(function(result) {
                if(!result){
                    User.addUser(email, password)
                        .then(function(id) {
                            res.send((lib.genAjaxRet(0, 'success', id)));
                        });
                }else{
                    var msg = lib.s('EMAIL_EXISTS');
                    var ret = lib.genAjaxRet(10001, msg);
                    res.send(ret);
                }
            }, function(err) {
                handleErr(res,err);
            });
        }
    };

    function handleErr(response,err){
        response.send(lib.genAjaxRet(-400,err));
    }
}());

