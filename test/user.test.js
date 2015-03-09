var user = require('../controllers/modal/user.js');
var should = require('should');
var user1 = new user(29,'acs1899@163.com','123123');

describe('user.js',function(){
    it('function emailAlreadyExists : acs1899@163.com is exist',function(done){
        function resolve(result){
            result.should.have.length(1);
            done();
        }
        user.emailAlreadyExists('acs1899@163.com')
            .then(resolve,done)
            .catch(done);
    });

    it('function save : {email:acs1899@163.com,pass:123123}',function(done){
        function resolve(result){
            done();
        }
        user1.save().then(resolve,done).catch(done);
    });
});
