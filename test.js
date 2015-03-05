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
p(1).then(function(result){console.log(result)},function(reason){console.log(reason)})
