const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// step 1 for : 'create local strategy'; this './signin' strat comes after JWT strategy below
const localOptions = { usernameField: 'email'};  // options = where to look in req for email instead of default setting of username

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {  
    User.findOne({ email: email }, (err, user)=> {
        if (err)  return done(err);
        if (!user) return done(null, false);
        // compare req.password === user.password; /models/user.js add function: userSchema.methods.comparePassword()
        user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if(!isMatch) return done(null, false);
            return done(null, user);   // passport with done() assigns user to req.user which is accessed inside controller - fantastic!
        });
    });    
});

// --------------------------------------------------------------------------------
// jwtOptions for step 2 below; code is similar as jwtLogin
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),  // when request comes in for passport to handle, look in header 'authorization'
    secretOrKey: config.secret  // secret to decode token
}; 

// Step 2 for 'Create new JWT strategy' - object and function that gets called whenever user needs jwt authentication to access restricted routes
// done callback: if user Id in payload exists in db call done with that user obj otherwise call done with 'false'
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {   // payload = jwt decoded token: 'sub: userid' and 'iat: timestamp' from 'return jwt encode'
    User.findById(payload.sub, (err, user) => {
        if (err)  return done(err, false); 
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        };
    });
});

// tell passport ot use this strategy
passport.use(jwtLogin);
passport.use(localLogin)