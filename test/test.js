var app = require('../app.js');
var http = require('http');

var qs = require('querystring');

var post_data = {
    email: 'acs1899@163.com'
}


var content = qs.stringify(post_data);

var options = {
    hostname: '127.0.0.1',
    port: 8080,
    path: '/emailexists',
    method: 'POST',
    headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
};

var req = http.request(options, function (res) {
    //console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log(chunk);
    });
});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(content);
req.end();
