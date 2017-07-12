'use strict';

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      User = require('../models/user-model'),
      config = require('../config/main');

function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 60*1000 // in seconds
    });
}

// Set user info from original User object
function setUserInfo(user) {
    return {
        _id: user._id,
        firstName: user.name.firstName,
        lastName: user.name.lastName,
        email: user.email
    }
}

module.exports = function() {
    const login = function(req, res, next) {
        let userInfo = setUserInfo(req.user);
        
        res.status(200)
            .json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
    }

    return {
        login: login
    }
}