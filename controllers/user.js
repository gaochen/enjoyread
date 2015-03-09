;
(function(){

    var Promise = require('promise');
    var mysql = require(__dirname + '/../core/mysql');
    var lib = require(__dirname + '/../core/lib');
    var User = require(__dirname + '/modal/user');
    var Setting = require(__dirname + '/modal/setting');

    var proto = module.exports = {};
    proto.post = {};
    proto.get = {};

    proto.before = function(req, res, next) {
        connect = mysql.connect(__dirname + '/../mysql.json', 'enjoyread');
        if (!req.session.uid) {
            //for debug
            //req.session.uid = 58;
            //debug dong
            var message = lib.genAjaxRet(10001, lib.s('ACCESS_DENY'));
            res.end(message);
        }
        next();
    }

    proto.post.changepassword = function(req, res) {
        var oldPassword = req.body.oldpassword;
        var newPassword = req.body.newpassword;
        var uid = req.session.uid;

        var user = new User(uid);
        User.validUser(user.email, oldPassword).then(function() {
            user.changePassword(newPassword).then(function() {
                res.end(lib.genAjaxRet(0));
            }, function() {
                res.end(lib.genAjaxRet(20001, lib.s('CHANGE_PASSWORD_FAILED')));
            });
        }, function() {
            res.end(lib.genAjaxRet(20000, lib.s('INVALID_PASSWORD')));
        });
    }

    proto.post.savesetting = function(req, res) {
        var setting = new Setting(req.session.uid);
        var pushtime = req.body.pushtime || '';
        var rss = req.body.rss || [];

        setting.init().then(function(setting) {
            setting.pushtime = pushtime;
            setting.rss = rss;
            setting.save();
            res.end(lib.genAjaxRet(0));
        }, function(err) {
            console.log(err);
        });
    };

    proto.get.rss = function(req, res) {
        var uid = req.session.uid;
        var setting = new Setting(uid);
        setting.getUserAll().then(function(rss) {
            res.end(lib.genAjaxRet(0, 'success', rss));
        });
    }

}());
