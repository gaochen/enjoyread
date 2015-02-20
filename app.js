var express = require("express");
var app = express();

// set template engine to jade
app.set("view engine", "jade");

// set views directory
app.set('views', __dirname + '/views');

// set static files
app.use(express.static(__dirname + '/static/js'));
app.use(express.static(__dirname + '/static/image'));
app.use(express.static(__dirname + '/static/css'));

require('./core/boot.js')(app);

app.listen(8080);
