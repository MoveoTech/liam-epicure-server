"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../services/auth.service");
const guardAuth = (req, res, next) => {
    try {
        const token = req.headers["access-token"]?.toString();
        const decodedToken = (0, auth_service_1.verifyToken)(token);
        res.status(200).json(decodedToken);
    }
    catch (error) {
        res.statusMessage = error.message;
        res.status(401).send(error);
    }
};
exports.default = guardAuth;
