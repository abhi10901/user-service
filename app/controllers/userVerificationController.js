'use strict';

module.exports = function(userService) {

    const verifyUser = function(req, res, next) {
        var userId, verificationCode;// = req.params.id;
        //var verificationCode = req.body.verificationCode;

        try {
            userId = req.params.id;
            verificationCode = req.body.verificationCode;

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

                if(user.verificationCode !== verificationCode) {
                    res.status(400)
                    .send({error: 'Wrong verification code: ' + verificationCode});
                    return next();
                }

                userService.updateToVerified(userId, function(err){
                    if(err) {
                        console.error(err.message);
                        res.status(500)
                        .send({error: 'Error updating user: ' + err.message});
                        return next();
                    }

                    res.status(200)
                    .send({message: 'User verified successfully. Please set your password.'});
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

    return {
        verifyUser: verifyUser
    }
};