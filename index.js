var server = require('./app/server'),
    config = require('./app/config/main'),
    async = require('async'),
    mongoose = require('mongoose');

async.waterfall([
        connectDatabase,
        startServer
    ],
    function(err) {
        if(err) {
            throw new Error('An error has occurred during the application bootstrap, killing the process');
        }
    }
);

function startServer(callback) {
    console.log("Bootstrap - running startServer");
    server.start(config.port, callback);
}

function connectDatabase(callback) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.database, {}, callback);
    //callback(null);
}
