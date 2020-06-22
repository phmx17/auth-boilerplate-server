const jwt = require('jwt-simple');  // json web tolken
const User = require('../models/user');
const config = require('../config');

// first step create token for User, to be used later
const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
exports.signin = (req, res, next) => {
    // at this point user is authorized by passport(local); supply token here
    // passport made access to req.user possible with done() in passport.js service
    res.send({ token: tokenForUser(req.user) })
}

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: 'must supply both email and password!' })
    }

    // see if email exists
    User.findOne({ email }, (err, existingUser) => {
        if (err) 
        return next(err);
    
        // if yes return error
        if (existingUser) 
        return res.status(422).send({ error: 'Email already in use' });

        // otherwise create new user and .save()
        const user = new User({
            email,
            password
        });

        user.save((err) => {
            if (err) return next(err);
        });
        
        // positive response
        res.json({token: tokenForUser(user) })
    });
}