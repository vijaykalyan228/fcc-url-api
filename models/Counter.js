'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterSchema = new Schema({
    count: { type: Number, default: 1 }
});

var Counter = mongoose.model('Counter', counterSchema);

var counter;

var nextVal = function(callback) {

    //Update Here to Model
    if (counter == null) {
        counter = new Counter({ count: 1 });
        counter.save();
        callback(1);
    } else {
        counter.update({ $inc: { count: 1 } }, (err, res) => {
            if (err) return;
            console.log('Else: ' + counter.count);
            callback(counter.count);
        });
    }
};

// export default model('Counter', Counter);
// exports.nextVal = nextVal;
module.exports = mongoose.model('Counter', counterSchema);