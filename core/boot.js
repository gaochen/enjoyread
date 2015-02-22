;
(function(){

    var fs = require('fs');

    module.exports = function(app) {
        fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
            var controller = require(__dirname + '/../controllers/' + name);
            for (var method in controller) {
                for (var action in controller[method]) {
                    if (~['after', 'before'].indexOf(action)) continue;
                    var path = '/';
                    if (name !== 'index.js') {
                        path += '/' + name.toLowerCase().replace('.js', '');
                    }
                    if (action !== 'index') {
                        path += action.toLowerCase();
                    }
                    if (controller['before']) {
                        app.use(controller['before']);
                    }
                    app[method](path, controller[method][action]);
                }
            }
        });

    }

    

}());
