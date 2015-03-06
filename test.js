/*function* generator() {
    yield 'hehe';
    yield 'xixi';
}

var a = generator();

/*console.log(a.next().value);
console.log(a.next().value);
console.log(a.next().value);*/

var P = require('promise');

function p(ex){
    return new P(function(resolve,reject){
        if(ex){
            resolve(ex)
        }else{
            reject(ex);
        }
    });
}
var p1 = p(1);
p1.then(function(result){console.log(1);},function(reason){console.log(reason)})
    .then(function(res){console.log(2);return p1},function(reason){})
    .then(function(){console.log(3)})
