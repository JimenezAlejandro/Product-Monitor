const tracker = require('../services/tracker');


module.exports = (app) => {
    app.get('/', loggedIn, function(req, res) {
        let trackers = [];
        tracker.getAllByUser(req.user._id)
            .then((vals) => {
                vals.forEach(track => {
                    trackers.push(track);
                });
                res.render('index', { message: req.flash('info'), error: req.flash('error'), trackers: trackers });
            })
            .catch((err) => {
                console.log(err);
                res.render('index', { message: req.flash('info'), error: req.flash('error'), trackers: '' });
            });
    });
};

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}