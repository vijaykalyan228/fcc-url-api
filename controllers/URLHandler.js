'use strict';

var Counter = require('../models/Counter');


// Connect to MongoDB


function nextVal(req, res, callback) {
    console.log('In func');
    Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, (err, data) => {
        if (err) {
            console.log('Error!');
            callback(null);
        }
        if (data) {
            console.log('If successful');

            callback(data.count);
        } else {
            console.log('Else success');

            var ctr = new Counter({ count: 1 });
            ctr.save((err) => {
                if (err) return;
                callback(ctr.count);
            });
        }
    });
    console.log('Exit func');

}

exports.addUrl = function(req, res) {
    // let url = req.body.url;
    // console.log(req.body.url);

    nextVal(req, res, (count) => {
        console.log(count);
    });

    // Get  Count and Increment value

    // Create URL Object and Save
    // Return count to user
    res.send(req.body.url);
}