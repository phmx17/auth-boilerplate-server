const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// define User model
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// on Save Hook, encrypt password first
userSchema.pre('save', function(next){  // refrain from making this into a '=>' ; it will loose binding to this !!
    const user = this;  // optional: show that user is the caller
    
    // generate a salt and then run callback
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        
        // encrypt password with salt
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next(); // go and save the model now
        });
    });
});

// give userSchema access to functions defined on .methods property
userSchema.methods.comparePassword = function(candidatePassword, callback) { // do NOT make this an arrow =>{} because 'this' is invoked below !!!
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {    // this.password is hashed and salted, coming from DB.
        if (err) return callback(err);
        callback(null, isMatch);
    });    
};
// export the model
module.exports = mongoose.model('user', userSchema)

