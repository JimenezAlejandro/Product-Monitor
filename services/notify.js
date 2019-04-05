const nodemailer = require('nodemailer');
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('User');


let transporter = nodemailer.createTransport({
    host: "mail.gmx.com",
    port: 587,
    secure: false,
    auth: {
        user: keys.notificationUser,
        pass: keys.notificationPass
    }
});

module.exports = (tracker, size) => {
    User.findOne({ _id: tracker.user }, function(err, user) {
        if (err) { console.log('Could not send notification: ' + err); }
        else if (!user) {
            console.log('Could not find user to receive notification.');
        } else {
            let mailOptions = {
                from: keys.notificationUser,
                to: user.phone + keys.defaultProvider,
                subject: "Product Tracker",
                text: tracker.name + ' size ' + size + ' is now in stock.\n' + tracker.url
            };

            transporter.sendMail(mailOptions)
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });
};
