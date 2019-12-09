'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlRecords = new Schema({
    url: { type: String, required: true },
    index: { type: Number, required: true }
});

module.exports = mongoose.model('UrlRecords', UrlRecords);