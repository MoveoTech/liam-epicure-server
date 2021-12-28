import { Types, model, Schema } from "mongoose";

export interface IRestaurant {
    imgUrl: string,
    name: string,
    description: string,
    chef: Types.ObjectId | string,
    dishes: Types.ObjectId[] | string[],
    signatureDish: Types.ObjectId | string,
    status: number
}

const RestaurantSchema = new Schema<IRestaurant>({
    imgUrl: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    chef: { type: Types.ObjectId, ref: "Chef", required: true },
    dishes: [{ type: Types.ObjectId, ref: "Dish" }],
    signatureDish: { type: Types.ObjectId, ref: "Dish" },
    status: { type: Number, required: true }
});

export const RestaurantModel = model("Restaurant", RestaurantSchema);