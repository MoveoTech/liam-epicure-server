import { Types, model, Schema } from "mongoose";

export interface IRestaurant {
    imgUrl: string, // base64
    name: string,
    description: string,
    chef: Types.ObjectId,
    dishes: Types.ObjectId[],
    signatureDish: Types.ObjectId
}

const RestaurantSchema = new Schema<IRestaurant>({
    imgUrl: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    chef: { type: Types.ObjectId, ref: "Chef", required: true },
    dishes: [{ type: Types.ObjectId, ref: "Dish" }],
    signatureDish: { type: Types.ObjectId, ref: "Dish", required: true }
});

export const RestaurantModel = model("Restaurant", RestaurantSchema);