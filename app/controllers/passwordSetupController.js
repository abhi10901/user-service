'use strict';

const passwordHash = require('password-hash');

module.exports = function(userService) {

    const setPassword = function(req, res, next) {
        var password, confPassword, userId;

        try {
            userId = req.params.id;
            password = req.body.password;
            confPassword = req.body.confPassword;

            userService.findById(userId, function(err, user) {
                if(err) {
                    console.error(err.message);
                    res.status(500)
                    .send({error: 'Error finding user: ' + err.message});
                    return next();
                }

                if(!user) {
                    res.status(400)
                    .send({error: 'Invalid user id: ' + userId});
                    return next();
                }

                if(password !== confPassword) {
                    res.status(400)
                    .send({error: "Password does not match: " + password + ", " + confPassword});
                    return next();
                }

                var passHash = passwordHash.generate(password);
                userService.updatePassword(userId, passHash, function(err) {
                    if(err) {
                        res.status(500)
                        .send({error: "Error updating password for user id: " + userId});
                        return next();
                    }

                    res.status(200)
                    .send({message: "Password set successfully."});
                    return next();
                });
            });
        } catch(err) {
            console.error(err.message);
                res.status(500)
                .send({error: 'Failed to process request: ' + err.message});
                return next();
        }
    };

    const resetPassword = function(req, res, next) {
        var newPassword, confPassword, oldPassword, userId;

        console.log('Resettig password');

        try {
            userId = req.params.id;
            oldPassword = req.body.oldPassword;
            newPassword = req.body.newPassword;
            confPassword = req.body.confPassword;

            userService.findById(userId, function(err, user) {
                if(err) {
                    console.error(err.message);
                    res.status(500)
                    .send({error: 'Error finding user: ' + err.message});
                    return next();
                }

                if(user === null) {
                    res.status(400)
                    .send({error: 'Invalid user id: ' + userId});
                    return next();
                }

                user.comparePassword(oldPassword, function(err, isMatch) {

                    if(!isMatch) {
                         res.status(400)
                            .send({error: "Incorrect old password: " + oldPassword });
                            return next();
                    }

                    if(newPassword !== confPassword) {
                        res.status(400)
                        .send({error: "Password does not match: " + newPassword + ", " + confPassword});
                        return next();
                    }

                    var newPasswordHash = passwordHash.generate(newPassword);
                    userService.updatePassword(userId, newPasswordHash, function(err) {
                        if(err) {
                            res.status(500)
                            .send({error: "Error updating password for user id: " + userId});
                            return next();
                        }

                        res.status(200)
                        .send({message: "Password reset successfully."});
                        return next();
                    });
                });
            });
        } catch(err) {
            console.error(err.message);
                res.status(500)
                .send({error: 'Failed to process request: ' + err.message});
                return next();
        }
    };

    return {
        setPassword: setPassword,
        resetPassword: resetPassword
    }
};