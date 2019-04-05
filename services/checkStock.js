const zara = require('./zara');
const schedule = require('node-schedule');
const notify = require('./notify');


module.exports = (tracker) => {
    zara.getAvailability(tracker.url)
        .then((inStock) => {
            tracker.sizes.some(size => {
                if (inStock[size]) {
                    notify(tracker, size);
                    tracker.active = false;
                    tracker.save((err, updatedTracker) => {
                        if (err) { console.log(err); }
                    });
                    schedule.scheduledJobs[tracker._id].cancel();
                    return true;
                }
            })
        })
        .catch((err) => {
            return err;
        });
};