;
(function(){

    var fs = require('fs');

    module.exports = function(app) {
        fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
            if (!name.match(/\.js$/)) {
                return;
            }
            var controller = require(__dirname + '/../controllers/' + name);
            var controllerRealName = name.toLowerCase().replace('.js', '');
            if (controller['before']) {
                app.all('/' + controllerRealName + '/*', controller['before']);
            }
            for (var method in controller) {
                for (var action in controller[method]) {
                    if (~['after', 'before'].indexOf(action)) continue;
                    var path = '/';
                    if (name !== 'index.js') {
                        path += controllerRealName + '/';
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
