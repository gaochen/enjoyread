;
(function(){

    var fs = require('fs');

    module.exports = function(app) {
        fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
            if (!name.match(/\.js$/)) {
                return;
            }
            var controller = require(__dirname + '/../controllers/' + name);
            for (var method in controller) {
                var cpath = name.toLowerCase().replace('.js', '');
                if (controller['before']) {
                    app.use(controller['before']);
                }
                for (var action in controller[method]) {
                    if (~['after', 'before'].indexOf(action)) continue;
                    var path = '/';
                    if (name !== 'index.js') {
                        path +='/' + cpath;
                    }
                    if (action !== 'index') {
                        path += action.toLowerCase();
                    }
                    
                    app[method](path, controller[method][action]);
                }
            }
        });
    }

}());
