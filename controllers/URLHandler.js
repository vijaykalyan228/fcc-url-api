'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

exports.addUrl = function(req,res){
  res.send(req.params);
}