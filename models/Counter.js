'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Counter = new Schema({
    count: { type: Number, default: 1 }
});

var counter;

var nextVal = function(callback) {
    const mongoUrl = "mongodb+srv://admin:admin@fccnodecluster-uv7h5.mongodb.net/test?retryWrites=true&w=majority";
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    Counter.findOneAndUpdate({}, { $inc: { 'count': 1 } }, (err, data) => {
        if (err) return;
        if (data) {
            callback(data.count);
        } else {
            new Counter().save((err) => {
                if (err) return;
                Counter.findOneAndUpdate({}, { $inc: { 'count': 1 } }, (err, data) => {
                    if (err) return;
                    callback(data.count);
                });
            });
        }
    });
};

// export default model('Counter', Counter);
exports.nextVal = nextVal;