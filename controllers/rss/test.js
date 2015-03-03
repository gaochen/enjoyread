var Rss = require('./rss');

new Rss(1).init().then(function(rss) {
    rss.getTodays();
    rss.getByTime();
}, function(err) {
    console.log(err);
});

