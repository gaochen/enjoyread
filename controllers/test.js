;
(function(){

    module.exports.show = function(req, res, next) {
        res.render('test');
    }

    module.exports.show1 = function(req, res, next) {
        res.write('hehe');
        res.end();
    }

}());

