var express = require('express');
var app = express();

var session = require('express-session');

// set template engine to jade
app.set('view engine', 'jade');

// set views directory
app.set('views', __dirname + '/views');

// set static files
app.use(express.static(__dirname + '/static/js'));
app.use(express.static(__dirname + '/static/image'));
app.use(express.static(__dirname + '/static/css'));

// make req.body work
var bodyParser = require('body-parser');
var multer = require('multer');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// use session
app.use(session({
    secret: '7Okd&#$1ldP',
    resave: false,
    saveUninitialized: false,
}));

require('./core/boot.js')(app);

//var mysql = require('./core/mysql.js');
//var conn = mysql.connect('./mysql.json', 'enjoyread');
//mysql.getData(function(err, res) {
//    console.log(res.insertId);
//}, 'insert into user(name, email) value ("louis", "dl_snaker@hotmail.com")');
app.listen(8080);
