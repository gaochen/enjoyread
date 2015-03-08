var user = require('../controllers/modal/user.js');
var should = require('should');

describe('user.js',function(){
    it('emailAlreadyExists : acs1899@163.com is exist',function(done){
        function resolve(result){
            result.should.have.length(1);
            done();
        }
        function reject(reason){
            reason.should.have.length(0);
            done();
        }
        user.emailAlreadyExists('acs1899@163.com').then(resolve,reject);
    });
});
