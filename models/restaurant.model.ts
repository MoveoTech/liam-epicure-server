import mongoose from "mongoose";

export interface IRestaurants{
    imgUrl: string, // base64
    header : string,
    content:string,
    chef: any,
    dishes: any[],
    signatureDish: any
}

const Schema = mongoose.Schema;
const RestaurantSchema = new Schema<IRestaurants>({
    imgUrl: {type: String, required: true},
    header: {type: String, required: true},
    content: {type: String, required: true},
    chef: {type: mongoose.Types.ObjectId, ref: "Chef"},
    dishes: [{type: mongoose.Types.ObjectId, ref: "Dish"}],
    signatureDish: {type: mongoose.Types.ObjectId, ref: "Dish"}
});

export const RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);