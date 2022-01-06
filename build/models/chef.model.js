"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChefModel = void 0;
const mongoose_1 = require("mongoose");
const ChefSchema = new mongoose_1.Schema({
    imgUrl: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    description: { type: String, default: null },
    restaurants: [{ type: mongoose_1.Types.ObjectId, ref: "Restaurant" }],
    status: { type: Number, required: true }
});
exports.ChefModel = (0, mongoose_1.model)("Chef", ChefSchema);
