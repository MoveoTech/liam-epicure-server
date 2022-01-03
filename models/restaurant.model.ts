import { Types, model, Schema } from "mongoose";

export interface IRestaurant {
    imgUrl: string | null,
    name: string,
    description: string |null,
    chef: Types.ObjectId | string | null,
    dishes: Types.ObjectId[] | string[] | null ,
    signatureDish: Types.ObjectId | string | null,
    status: number
}

const RestaurantSchema = new Schema<IRestaurant>({
    imgUrl: { type: String, default: null },
    name: { type: String, required: true },
    description: { type: String },
    chef: { type: Types.ObjectId, ref: "Chef" , default: null},
    dishes: [{ type: Types.ObjectId, ref: "Dish" , default: null}],
    signatureDish: { type: Types.ObjectId, ref: "Dish" , default: null},
    status: { type: Number, required: true }
});

export const RestaurantModel = model("Restaurant", RestaurantSchema);