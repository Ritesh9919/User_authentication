const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');


passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async function(req, email, password, done)  {
    try {
        
        const user = await User.findOne({ email: email });
        

        if (!user || password != user.password) {
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        
        console.log(err);
        return done(err);
    }
}
));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    return done(null, user.id);
})

// deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {

    try {
        const user = await User.findById(id);
        if(!user) {
            
            return done(null, user);
        }
        return done(null, user);
    } catch (err) {
       
        return done(err);
    }

})



passport.checkAuthentication = function(req, res, next)  {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/users/log-in');
}

passport.setAuthenticatedUser = function(req, res, next)  {
    if(req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    return next();
}


module.exports = passport;
