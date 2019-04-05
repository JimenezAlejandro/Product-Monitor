const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/user');
require('./models/tracker');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});
app.use(flash());

require('./routes/mainRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/trackerRoutes')(app);

require('./services/startJobs')();

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0');