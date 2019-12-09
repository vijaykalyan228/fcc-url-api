'use strict';
var dns = require('dns');
var Counter = require('../models/Counter');
var UrlRecord = require('../models/UrlRecords');

function nextVal(req, res, callback) {
    Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, (err, data) => {
        if (err) return;
        if (data) {
            callback(data.count);
        } else {
            var ctr = new Counter({ count: 1 });
            ctr.save((err) => {
                if (err) return;
                Counter.findOneAndUpdate({}, { $inc: { 'count': 1 } }, function(err, data) {
                    if (err) return;
                    callback(data.count);
                });
            });

        }
    });
}

exports.addUrl = function(req, res) {
    let url = req.body.url;

    // Remove / at the end
    if (url.match(/\/$/i))
        url = url.slice(0, -1);

    // Check if url is valid
    if (!url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)) {
        res.json({ "error": "invalid URL" });
    }

    // Check dns and update url record
    // console.log(new URL(url).hostname);

    dns.lookup(new URL(url).hostname, (err) => {
        if (err) {
            res.json({ "error": "invalid Hostname" });
        } else {
            UrlRecord.findOne({ 'url': url }, (err, record) => {
                if (err) return;
                if (record) {
                    res.json({ "original_url": url, "short_url": record.index });
                } else {
                    // Get next count
                    nextVal(req, res, (data) => {
                        var urlRecord = new UrlRecord({ 'url': url, 'index': data });
                        urlRecord
                            .save()
                            .then((result) => {

                                res.json({ 'original_url': result.url, 'short_url': result.index });
                            })
                            .catch((err) => {
                                console.log(err);
                                return;
                            });
                    });
                }
            });
        }
    });
};


exports.sendRedirect = function(req, res) {
    // console.log(req.params.index);
    const index = req.params.index;
    if (!parseInt(index, 10)) {
        // The short URL identifier is not a number
        res.json({ "error": "The short URL identifier is not a number" });
        return;
    }

    UrlRecord
        .findOne({ 'index': index })
        .then((data) => {
            if (data) {
                res.redirect(301, data.url);
            } else {
                res.json({ "error": "No short url found for given input" });
            }
        })
        .catch((err) => {
            console.log(err);
            return;
        });
};