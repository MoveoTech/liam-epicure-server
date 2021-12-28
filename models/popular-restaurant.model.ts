import { Types, model, Schema } from "mongoose";

export interface IPopularRestaurant {
    restaurant: Types.ObjectId | string,
    status: number
}

const PopularRestaurantSchema = new Schema<IPopularRestaurant>({
    restaurant: { type: Types.ObjectId, ref: "Restaurant", required: true },
    status: { type: Number, required: true }
})

export const PopularRestaurantModel = model("Popular-Restaurant", PopularRestaurantSchema);