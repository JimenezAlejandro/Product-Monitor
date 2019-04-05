const mongoose = require('mongoose');

const User = mongoose.model('User');


function notLoggedIn(req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = (req, res, next) => {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) { console.log(err); }
        if (user) {
            req.flash('error', 'User already exists.');
            res.redirect('/signup');
        }
        if (!user) {
            let newUser = new User({
                username: req.body.username,
                password: req.body.password,
                phone: req.body.phone
            });
            newUser.save(function(err) {
                if (err && err.errors && err.errors.username) {
                    req.flash('error', 'Not a valid email address.');
                    res.redirect('/signup');
                }
                else if (err && err.errors && err.errors.phone) {
                    req.flash('error', 'Not a valid phone.');
                    res.redirect('/signup');
                }
                else if (err) {
                    res.redirect('/signup');
                } else {
                    req.login(newUser, function(err) {
                        if (err) {
                            req.flash('error', 'Could not login automatically.');
                            res.redirect('/login');
                        }
                        next();
                    })
                }
            })
        }
    });
};