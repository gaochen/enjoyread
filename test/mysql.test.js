var myq = require('../core/mysql.js');
var should = require('should');

describe('mysql.js',function(){
    this.timeout(5000);
    /*test connect*/
    it('test function connect : connect is ok',function(done){
        myq.connect(__dirname+'/../mysql.json','enjoyread').connect(function(err){
            should.ifError(err);
            done();
        });
    });

    /*test runSql*/
    it('test function runSql :runSql is ok',function(done){
        myq.runSql('select * from user').then(function(result){
            result.should.be.Array;
            done();
        },done).catch(done);
    });

});
