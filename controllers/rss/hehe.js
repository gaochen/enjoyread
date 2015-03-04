
var Promise = require('promise');

function get() {
    return new Promise(function(resolve, reject) {
        var a = 1;
        resolve(a);
    });
}

function plus(a) {
    return a + 1;
}

function result(result) {
    console.log(result)
}

get().then(plus).then(plus).then(plus).then(result);
