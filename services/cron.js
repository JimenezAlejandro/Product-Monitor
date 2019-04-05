const mongoose = require('mongoose');
const schedule = require('node-schedule');
const checkStock = require('./checkStock');
const zara = require('./zara');

const Tracker = mongoose.model('Tracker');
const User = mongoose.model('User');

let jobCount = 0;

function runTask(tracker) {
    schedule.scheduleJob('' + tracker._id, jobCount++ % 60 + ' 6,12,18 * * *', checkStock);
};

module.exports = (searchTerm, sizes, uid) => {
    return zara(searchTerm, true)
        .then((data) => {
            const tracker = new Tracker({
                name: data.name,
                sizes: sizes,
                url: data.pageUrl,
                image: data.imageUrl,
                active: true,
                user: uid
            });
            return tracker.save(function(err) {
                if (err) { return false; };
                User.findByIdAndUpdate(uid, { $push: { tracking: tracker._id }}, (err, res) => {
                    if (err) { return false; }
                });
                runTask(tracker);
                return true;
            });
        })
        .catch((err) => {
            return false;
        });
};

module.exports.runTask = runTask;