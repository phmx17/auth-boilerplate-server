const Authentication = require ('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// final step: create 'middleware interceptor' that gets injected into request before route is called
const requireAuth = passport.authenticate('jwt', { session: false }); // session: false because passport by default wants to create cookie session;
// interceptor for /signin
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
    // test signin: pass!
    app.post('/signin', requireSignin, Authentication.signin )

    //test requireAuth: pass!
    app.get('/feature', requireAuth, (req, res) => {
        res.send({ success: 'requireAuth success' });
    })

    app.post('/signup', Authentication.signup); // Authentication controller
};