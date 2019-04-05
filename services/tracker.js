const mongoose = require('mongoose');
const schedule = require('node-schedule');

const Tracker = mongoose.model('Tracker');
const User = mongoose.model('User');

module.exports.remove = async (id) => {
    let tracker = await Tracker.findByIdAndRemove(id);
    await User.findByIdAndUpdate(tracker.user, { $pull: { tracking: tracker._id } });
    if (tracker) {
        if (schedule.scheduledJobs[id]) {
            schedule.scheduledJobs[id].cancel();
        }
        return true;
    } else {
        return false;
    }
};

module.exports.getAllByUser = async (uid) => {
    trackers = await Tracker.find({ user: uid });
    return trackers;
};

module.exports.get = async (id) => {
    tracker = await Tracker.findOne({ _id: id });
    return tracker;
}