"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configFile_1 = require("../configFile");
const verifyToken = (token) => {
    if (!token) {
        throw new Error("A token is required for authentication");
    }
    // If not verified - will throw an error 'jwt malformed'
    return jsonwebtoken_1.default.verify(token, configFile_1.config.JWT_KEY);
};
exports.verifyToken = verifyToken;
