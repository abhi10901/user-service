'use strict';

const express = require('express'),
      userRouter = express.Router(),
      passportService = require('../config/passport'),
      passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

module.exports = function() {

    const userService = require('../services/userService')();
    
    const authenticationController = require('../controllers/authenticationController')();
    const userRegistrationController = require('../controllers/userRegistrationController')(userService);
    const userVerificationController = require('../controllers/userVerificationController')(userService);
    const passwordSetupController = require('../controllers/passwordSetupController')(userService);
    const userLoginController = require('../controllers/userLoginController')(userService);

    //registration
    userRouter.route('/register')
        .post(userRegistrationController.registerUser);

    //verification
    userRouter.route('/:id/verify')
        .post(userVerificationController.verifyUser);

    //password setup
    userRouter.route('/:id/setPassword')
        .post(passwordSetupController.setPassword);

    userRouter.route('/:id/resetPassword')
        .post(
            requireAuth,
            passwordSetupController.resetPassword
        );

    //login
    userRouter.route('/login')
        .post(requireLogin, authenticationController.login)
        //.post(userLoginController.login);

    return userRouter;
};