var express = require("express"),
    bodyParser = require("body-parser"),
    config = require('./config/main'),
    authorization = require('./authorization');

function Server() {
    //setup application port
    //this.port = config.port;

    this.app = express();

    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());

    // Middleware will goes here...
    this.app.use(require('./middleware/cors-middleware'));
    //this.app.use(authorization.authorizedUser);

    this.app.use('/', require('./routes/supportRoutes')());
    this.app.use('/user', require('./routes/userRoutes')());

}

Server.prototype.start = function(port, callback) {
    this.app.listen(port);
    console.log('Server started...listening on http://localhost:%s', port);
    callback(null);
};

module.exports = new Server();