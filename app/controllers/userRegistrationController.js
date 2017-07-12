'use strict';

module.exports = function(userService) {

    const registerUser = function(req, res, next) {
        var user;

        console.log('registering user');
        try {
            user = req.body;

            userService.isEmailRegistered(user.email, function(err, exist) {
                if(err) return err;
                if(!exist) {
                    userService.registerUser(user, function(error, result) {
                        if(error) {
                            console.error(error.message, {user: user});
                            res.status(500)
                                .send({error: "Error writing new user to database: " + error.message});
                        }
                        else if(result._id !== undefined) {
                            //emailService.sendVerificationCode(result);
                            console.log(result);
                            res.status(201)
                                .send({
                                        message: 'User created successfully',
                                        user: result
                                });
                        }
                        else {
                            console.log(result);
                            res.status(500)
                                .send({error: "Error writing user to database: 0 rows affected"});
                        }
                        return next();
                    });

                } else {
                    res.status(409)
                    .send({
                            message: "Email already registered: " + user.email
                    });
                    return next();
                }
            });
        } catch(err) {
            console.error(err.message, {user: user});
            res.status(500)
                .send({error: 'Failed to process request: ' + err.message});
            return next();
        }
    };

    const emailRegistered = function(req, res, next) {
        var email = req.body.email;

        userService.findByEmail(email, function(err, result) {
            if(err) {
                console.error(err.message);
                res.status(500)
                    .send({error: err.message});
            }
            else {
                console.log("User exist with email: " + email);
                res.status(200)
                    .send({message: "User exist with email: " + email});
            }
            return next();
        });
    };

    return  {
        registerUser: registerUser
    }
};

function isEmailRegistered(email) {
    userService.isEmailRegistered(email, function(err, exist) {
        if(err) return err;
        
        //console.log(exist);
        return exist;
    });
}