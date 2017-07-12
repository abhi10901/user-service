'use strict';

const jwt = require('jsonwebtoken'),
      passwordHash = require('password-hash');

module.exports = function(userService) {
    
    const login = function(req, res, next) {
        var email, password;

        try {
            email = req.body.email;
            password = req.body.password;

            userService.findByEmail(email, function(err, user) {
                if(err) {
                    res.status(500)
                    .send({error: 'Error find user by email: ' + email});
                    return next();
                }

                if(!user) {
                    res.status(400)
                    .send({error: 'User not exist with this email: ' + email});
                    return next();
                }

                if(!passwordHash.verify(password, user.passwordHash)) {
                    res.status(401)
                    .send({error: 'Wrong password'});
                    return next();
                }

                res.status(200)
                .send({token: generateJwtToken(user)});
                return next();
            });
        } catch(err) {
            res.status(500)
            .send({error: 'Failed to process request: ' + err.message});
            return next();
        }
    };

    const loginRequired = function(req, res, next) {
        if(req.user)
            return next()

        return res.status(401)
                    .send({error: 'Unauthorized user...'});
    };

    return {
        login: login,
        loginRequired: loginRequired
    }
};

function generateJwtToken(user) {
    return jwt.sign({
        email: user.email,
        fullName: user.name.firstName + " " + user.name.lastName,
        _id: user._id
    },
   'RESTFULAPIs');
}