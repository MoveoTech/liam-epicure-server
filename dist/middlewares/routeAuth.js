"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../services/auth.service");
const routeAuth = (req, res, next) => {
    try {
        const token = req.headers["access-token"]?.toString();
        // Will throw an error if token can't be verified.
        (0, auth_service_1.verifyToken)(token);
        next();
    }
    catch (error) {
        res.statusMessage = error.message;
        res.status(401).send(error);
    }
};
exports.default = routeAuth;
