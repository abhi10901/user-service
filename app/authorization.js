'use strict';

const jwt = require('jsonwebtoken');

module.exports.authorizedUser = function(req, res, next) {
    if(req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {

        jwt.verify(req.headers.authorization.split(' ')[1],
                    "RESTFULAPIs", function(err, decode) {
            if(err)
                return (req.user = undefined);

            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
};