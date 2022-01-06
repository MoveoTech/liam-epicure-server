"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("config");
const connect = async () => {
    await mongoose_1.default.connect(config_1.config.MONGO_URI)
        .then(() => console.log("Connected to DB"))
        .catch((err) => console.log("Failed to connect to DB", err.message));
};
exports.connect = connect;
