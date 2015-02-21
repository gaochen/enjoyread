;
(function(){

    module.exports.get = {
        login: function(req, res, next) {
            res.render('login');
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
        login: function(req, res, next) {
            //the login magic
        }
    };
}());
