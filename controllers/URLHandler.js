'use strict';

var express = require('express');
var app = express();
var Counter = require('../models/Counter');


exports.addUrl = function(req, res) {
    // let url = req.body.url;
    console.log(req.body.url);

    Counter.nextVal((count) => {
        console.log(count);
    });

    // Get  Count and Increment value

    // Create URL Object and Save
    // Return count to user
    res.send(req.body.url);
}