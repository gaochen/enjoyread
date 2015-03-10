var user = require('../controllers/modal/user.js');
var should = require('should');
var user1 = new user(29,'acs1899@163.com','123123');
var user2 = new user(0,'acs1899@163.com','123123');

describe('user.js',function(){
    this.timeout(5000);
    /*test emailAlreadyExists*/
    it('test function emailAlreadyExists : acs1899@163.com is exist',function(done){
        function resolve(result){
            result.should.be.true;
            done();
        }
        user.emailAlreadyExists('acs1899@163.com')
            .then(resolve,done)
            .catch(done);
    });

    /*test emailAlreadyExists*/
    it('test function emailAlreadyExists : acs1899@localhost.com is not exist',function(done){
        function resolve(result){
            result.should.be.false;
            done();
        }
        user.emailAlreadyExists('acs1899@localhost.com')
            .then(resolve,done)
            .catch(done);
    });

    /*test save*/
    it('test function save : update {email:acs1899@163.com,pass:123123}',function(done){
        function resolve(result){
            result.should.equal('update success');
            done();
        }
        user1.save().then(resolve,done).catch(done);
    });

    /*test get*/
    it('test function get : id:29 is acs1899@163.com',function(done){
        function resolve(result){
            result.should.containDeep({email:'acs1899@163.com',id:29});
            done();
        }
        user1.get().then(resolve,done).catch(done);
    });

    /*test get*/
    it('test function get : id:0 is not acs1899@163.com',function(done){
        function resolve(result){
            result.should.equal('No such user');
            done();
        }
        user2.get().then(resolve,done).catch(done);
    });

    /*test addUser*/
    it('test function addUser : {email:acs1899@163.com,password:123123}',function(done){
        function resolve(result){
            result.should.equal('the email is exist');
            done();
        }
        user.addUser('acs1899@163.com',123123).then(resolve,done).catch(done);
    });

    /*test validEmail*/
    var rstr = randomStr(8);
    it("test function validEmail : "+rstr+" isn't a email address",function(done){
        should.not.exist(user.validEmail(rstr));
        done();
    });

    /*test validEmail*/
    it("test function validEmail : acs1899@163.com is a email address",function(done){
        should.exist(user.validEmail('acs1899@163.com'));
        done();
    });

    /*test changePassword*/
    it('test function changePassword : {email:acs1899@163.com,id:29} change password to 123456',function(done){
        function resolve(result){
            should.exist(result);
            done();
        }
        user1.changePassword('123456').then(resolve,done).catch(done);
    });

    /*test validUser*/
    it('test function validUser : {email:acs1899@163.com,password:123456} can pass valid',function(done){
        function resolve(result){
            result.should.be.a.Number;
            done();
        }
        user.validUser('acs1899@163.com','123456').then(resolve,done).catch(done);
    });

    /*test validUser*/
    it('test function validUser : {email:acs1899@163.com,password:123123} can not pass valid',function(done){
        function resolve(result){
            result.should.equal('email or password is wrong');
            done();
        }
        user.validUser('acs1899@163.com','123123').then(resolve,done).catch(done);
    });
});

function randomStr(len){
    var len = len || 16;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
　　    maxPos = $chars.length,
        pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd
}
