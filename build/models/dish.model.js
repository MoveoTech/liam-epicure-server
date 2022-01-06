"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishModel = void 0;
const mongoose_1 = require("mongoose");
const DishSchema = new mongoose_1.Schema({
    imgUrl: { type: String, default: null },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: null },
    restaurant: { type: mongoose_1.Types.ObjectId, ref: "Restaurant", default: null },
    icons: [{ type: mongoose_1.Types.ObjectId, ref: "Icon" }],
    status: { type: Number, required: true }
});
exports.DishModel = (0, mongoose_1.model)("Dish", DishSchema);
