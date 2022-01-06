"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconModel = void 0;
const mongoose_1 = require("mongoose");
const IconScehma = new mongoose_1.Schema({
    imgUrl: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Number, required: true }
});
exports.IconModel = (0, mongoose_1.model)("Icon", IconScehma);
