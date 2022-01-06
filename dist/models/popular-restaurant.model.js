"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopularRestaurantModel = void 0;
const mongoose_1 = require("mongoose");
const PopularRestaurantSchema = new mongoose_1.Schema({
    restaurant: { type: mongoose_1.Types.ObjectId, ref: "Restaurant", required: true },
    status: { type: Number, required: true }
});
exports.PopularRestaurantModel = (0, mongoose_1.model)("Popular-Restaurant", PopularRestaurantSchema);
