;
(function(){

    var fs = require('fs');

    module.exports = function(app) {
        fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
            var controller = require(__dirname + '/../controllers/' + name);
            for (var action in controller) {
                if (~['after', 'before'].indexOf(action)) continue;
                var path = '/' + name.toLowerCase().replace('.js', '') + '/' + action.toLowerCase();
                var method = controller[action].method || 'get';
                app[method](path, controller[action]);
            }
        });

    }

    

}());
