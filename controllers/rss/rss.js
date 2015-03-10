;
(function() {

    var mysql = require(__dirname + '/../../core/mysql');
    var Promise = require('promise');
    var FeedParser = require('feedparser');
    var request = require('request');

    var Rss = module.exports = function(id) {
        this.id = id;
        this.connect = mysql.connect(__dirname + '/../../mysql.json', 'enjoyread');
        this.request;
        this.data = [];
    };

    Rss.prototype.init = function() {
        var that = this;
        return new Promise(function(resolve, reject) {
            mysql.getLine('select * from rss where id = ?', [that.id]).then(function(result) {
                that.connect.destroy();
                if (!result) {
                    throw new Error('no such rss');
                }
                that.url = result['url'];
                that.name = result['name'];
                that.picture = result['picture'];
                that.type = result['type'];
                resolve.call(that, that);
            }, reject);
        });
    };

    Rss.prototype.getTodays = function() {
        var req = request(that.url, {timeout: 10000, pool: false});
        req.on('response', function (res) {
            var stream = this;
            if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
            stream.pipe(feedparser);
        });
    }

    Rss.prototype.getxml = function(rss) {
        var that = rss;
        return new Promise(function(resolve, reject){
            var req = request(that.url, {timeout: 10000, pool: false});
            var feedparser = new FeedParser();
            req.on('error', reject);
            req.on('response', function(res) {
                res.pipe(feedparser);
            });

            feedparser.on('readable', function() {
                while (post = this.read()) {
                    that.data.push(post);
                    break;
                }
            });

            feedparser.on('error', reject);
            feedparser.on('end', function() {
                resolve(that.data);
            });
        });
    }

    Rss.prototype.bytime = function() {

    }

    Rss.prototype.by= function() {
    }

    var a = new Rss(1);
    a.init().then(a.getxml).then(function(result) {
        console.log(result);
    }, function(err) {
        console.log(err);
    });

}());
