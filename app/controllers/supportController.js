'use strict';

const version = require('../../package.json').version;

const supportController = function() {
    var middleware = function(req, res, next) {
        /**
         * Add here some middleware functionalities;
         */

        next();
    };

    var root = function(req, res, next) {
        res.status(200)
            .send("Welcome to User Service App");
        return next();
    };

    var getVersion = function(req, res, next) {
        res.contentType = 'text';
        res.status(200)
            .send(version);
        return next();
    };

    var getInfo = function(req, res, next) {
        //This functionality needs to implement later
         res.sendStatus(200);
         return next();
    };

    var getHealth = function(req, res, next) {
        /**
         * This service will first check database connection
         * is active and send 200 status code or else send
         * 503 status code for failed to process request
         * 
         * Still need to implement database connectivity check
         */

        res.status(200)
            .send({healthy: true});
        return next();
    }

    return {
        middleware: middleware,
        getRoot: root,
        getVersion: getVersion,
        getInfo: getInfo,
        getHealth: getHealth
    }
};

module.exports = supportController;