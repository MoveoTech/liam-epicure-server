"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyChefModel = void 0;
const mongoose_1 = require("mongoose");
const SignatureDishSchema = new mongoose_1.Schema({
    chef: { type: mongoose_1.Types.ObjectId, ref: "Chef", required: true },
    status: { type: Number, required: true }
});
exports.WeeklyChefModel = (0, mongoose_1.model)("Weekly-Chef", SignatureDishSchema);
