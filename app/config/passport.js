'use strict';

// Importing Passport, strategies and config
const passport = require('passport'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local'),
      User = require('../models/user-model'),
      config = require('./main');

const localOptions = {usernameField: 'email'};

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    User.findOne({email: email})
        .exec()
        .then(function(user) {
            if(!user) return done(null, false, {
                                error: 'Invalid Login details. Please try again'
                            });
            
            user.comparePassword(password, function(err, isMatch) {
                //if(err) return done(err);
                if(!isMatch) return done(null, false, {
                    error: 'Your Login details could not be verified.'
                });

                done(null, user);
            })
        })
        .catch(function(err) {
            done(err);
        });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),

    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    User.findById(payload._id)
        .exec()
        .then(function(user) {
            if(!user) return done(null, false);
            done(null, user);
        })
        .catch(function(err) {
            done(err, false);
        })
})

passport.use(jwtLogin);
passport.use(localLogin);