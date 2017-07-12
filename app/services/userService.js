var mongoose = require('mongoose'),
    User = require('../models/user-model');

module.exports = function() {
    const registerUser = function(user, callback) {
        var newUser = new User(user);

        newUser.save(function(err, user) {
            if(err) {
                return callback(err);
            }
            return callback(null, user);
        });
    };

    const isEmailRegistered = function(email, callback) {
        this.findByEmail(email, function(err, user) {
            if(err) return callback(err);

            if(user === null) return callback(null, false);

            return callback(null, true);
        });
    };

    const findById = function(id, callback) {
        User.findById(id, function(err, user) {
            if(err) return callback(err);

            return callback(null, user);
        });
    };

    const findByEmail = function(email, callback) {
        var query = User.where({email: email});
        query.findOne(function(err, user) {
            if(err) return callback(err);

            console.log(user);
            return callback(null, user);
        });
    };

    const updatePassword = function(id, passwordHash, callback) {
        User.findOneAndUpdate({_id: id}, {$set: {passwordHash: passwordHash}}, function(err, user) {
            if(err) return callback(err);

            return callback(null);
        });
    };

    const updateToVerified = function(id, callback) {
        User.findOneAndUpdate({_id: id}, {$set: {verified: true}}, function(err, user) {
            if(err)
                return callback(err);
            return callback(null);
        });
    };

    return {
        registerUser: registerUser,
        isEmailRegistered: isEmailRegistered,
        findById: findById,
        findByEmail: findByEmail,
        updatePassword: updatePassword,
        updateToVerified: updateToVerified
    }
};