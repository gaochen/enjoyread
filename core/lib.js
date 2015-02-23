;
(function() {

    var fs = require('fs');
    var lantype = 'en';
    var lan = JSON.parse(fs.readFileSync(__dirname + '/../lan/' + lantype + '/lan.json'));

    module.exports.genAjaxRet = function(code, msg, data) {
        var result = {
            code: code,
            msg: msg || 'success',
            data: data || null,
        };
        return JSON.stringify(result);
    }

    module.exports.s = function(key) {
        return lan[key];
    }

}());
