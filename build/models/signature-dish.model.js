"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureDishModel = void 0;
const mongoose_1 = require("mongoose");
const SignatureDishSchema = new mongoose_1.Schema({
    dish: { type: mongoose_1.Types.ObjectId, ref: "Dish", required: true },
    status: { type: Number, required: true }
});
exports.SignatureDishModel = (0, mongoose_1.model)("Signature-Dish", SignatureDishSchema);
