'use strict';

const express = require('express'),
      supportRouter = express.Router();

const router = function() {
    var supportController = require('../controllers/supportController')();

    supportRouter.use(supportController.middleware);

    supportRouter.route("/")
        .get(supportController.getRoot);

    supportRouter.route("/version")
        .get(supportController.getVersion);

    supportRouter.route("/info")
        .get(supportController.getInfo);

    supportRouter.route("/health")
        .get(supportController.getHealth);

    return supportRouter;
};

module.exports = router;