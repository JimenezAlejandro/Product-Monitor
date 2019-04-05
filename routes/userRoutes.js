const passport = require('passport');
const signup = require('../services/signup');

module.exports = (app) => {
    app.get('/signup', notLoggedIn, function(req, res) {
        res.render('signup', { error: req.flash('error') });
    });

    app.post('/signup', signup, function(req, res) {
        res.redirect('/');
    });

    app.get('/login', notLoggedIn, function(req, res) {
        res.render('login', { error: req.flash('error') });
    });

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });
};

function notLoggedIn(req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.redirect('/');
    }
}