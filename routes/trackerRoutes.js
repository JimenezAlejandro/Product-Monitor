const zara = require('../services/zara');
const cron = require('../services/cron');
const tracker = require('../services/tracker');

module.exports = (app) => {
    app.get('/zara', loggedIn, function(req, res) {
        res.render('zara');
    });

    app.get('/tracker/edit', loggedIn, belongsToUser, function(req, res) {
        res.render('editTracker', { tracker: req.flash('tracker')[0], sizesAvailable: req.flash('sizesAvailable') });
    });

    app.get('/api/zara', function(req, res) {
        zara(req.query.searchTerm, true)
            .then((val) => {
                res.json({ data: val });
            })
            .catch((err) => {
                res.json( {data: err });
            })
    });

    app.get('/api/cron', function(req, res) {
        cron(req.query.searchTerm, req.query.sizes, req.user._id)
            .then((success) => {
                req.flash('info', 'New tracker created.');
                res.redirect('/');
            })
            .catch((err) => {
                req.flash('error', 'Tracker not created.');
                res.redirect('/');
            });
    });

    app.get('/api/tracker/remove', function(req, res) {
        tracker.remove(req.query.id)
            .then((success) => {
                req.flash('info', 'Tracker removed.');
                res.redirect('/');
            })
            .catch((err) => {
                req.flash('error', 'Tracker not removed.');
                res.redirect('/');
            });
    });

    app.get('/api/tracker/edit', function(req, res) {
        tracker.get(req.query.id)
            .then((track) => {
                zara.getSizes(track.url)
                    .then((sizes) => {
                        req.flash('tracker', track);
                        req.flash('sizesAvailable', sizes);
                        res.redirect('/tracker/edit');
                    })
                    .catch((err) => {
                        console.log(err);
                        res.redirect('/');
                    });
            })
            .catch((err) => {
                req.flash('error', 'Tracker not found.');
                res.redirect('/');
            });
    });

    app.get('/api/tracker/update', function(req, res) {
        tracker.get(req.query.id)
            .then((track) => {
                track.sizes = req.query.sizes;
                track.save()
                    .then((val) => {
                        req.flash('info', 'Tracker changes have been saved.');
                        res.redirect('/');
                    })
                    .catch((err) => {
                        req.flash('error', 'Tracker changes were not saved.');
                        res.redirect('/');
                    })
            })
            .catch((err) => {
                req.flash('error', 'Tracker not found.');
                res.redirect('/');
            });
    });
};

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

function belongsToUser(req, res, next) {
    let tracker = req.flash('tracker')[0];
    if (tracker) {
        if (tracker.user == req.user._id) {
            req.flash('tracker', tracker);
            next();
        } else {
            req.flash('error', "You don't have permission to edit that tracker.");
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
}