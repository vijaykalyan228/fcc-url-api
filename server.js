'use strict'

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');

var urlHandler = require('./controllers/UrlHandler.js');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
const mongoUrl = "mongodb+srv://admin:admin@fccnodecluster-uv7h5.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function(req, res) {

    console.log(mongoose.connection.readyState);
    res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl/new", urlHandler.addUrl);

app.listen(port, function() {
    console.log('Node.js listening ...');
});