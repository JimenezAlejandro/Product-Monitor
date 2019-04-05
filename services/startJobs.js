const mongoose = require('mongoose');
const cron = require('./cron');

const Tracker = mongoose.model('Tracker');

module.exports = () => {
    Tracker.find({ active: true }, (err, trackers) => {
        if (err) { return err; }
        trackers.map((tracker) => {
            cron.runTask(tracker);
        });
    });
};