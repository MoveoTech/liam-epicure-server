"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, default: "" },
    status: { type: Number, required: true, default: 1 }
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
