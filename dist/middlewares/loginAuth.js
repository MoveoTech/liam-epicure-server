"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configFile_1 = require("../configFile");
const user_model_1 = require("../models/user.model");
const mongoose_1 = require("mongoose");
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["access-token"]?.toString();
        if (token) {
            const jwtResult = jsonwebtoken_1.default.verify(token, configFile_1.config.JWT_KEY);
            if (jwtResult) {
                const user = await user_model_1.UserModel.findOne({ _id: new mongoose_1.Types.ObjectId(jwtResult.id), status: 1 });
                if (user) {
                    if (user.token === token) {
                        return res.status(200).json(jwtResult);
                    }
                }
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.default = verifyToken;
