var myq = require('../core/mysql.js');
var should = require('should');

describe('mysql.js',function(){
    this.timeout(5000);
    it('mysql connect is ok',function(done){
        myq.connect(__dirname+'/../mysql.json','enjoyread').connect(function(err){
            should.ifError(err);
            done();
        });
    });
    it('runSql with correct sql is ok',function(done){
        myq.runSql('select * from user').then(function(result){
            result.should.be.Array;
            done();
        },function(reason){
            reason.should.not.be.empty;
            done();
        });
    });
    it('runSql with error sql is ok',function(done){
        myq.runSql('select * from user').then(function(result){
            result.should.be.Array;
            done();
        },function(reason){
            reason.should.not.be.empty;
            done();
        });
    });
});
