"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModel = void 0;
const mongoose_1 = require("mongoose");
const RestaurantSchema = new mongoose_1.Schema({
    imgUrl: { type: String, default: null },
    name: { type: String, required: true },
    description: { type: String },
    chef: { type: mongoose_1.Types.ObjectId, ref: "Chef", default: null },
    dishes: [{ type: mongoose_1.Types.ObjectId, ref: "Dish", default: null }],
    signatureDish: { type: mongoose_1.Types.ObjectId, ref: "Dish", default: null },
    status: { type: Number, required: true }
});
exports.RestaurantModel = (0, mongoose_1.model)("Restaurant", RestaurantSchema);
