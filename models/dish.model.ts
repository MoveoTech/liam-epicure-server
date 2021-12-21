import {Types, model, Schema} from "mongoose";

export interface IDish{
    imgUrl : string, // base64
    name: string,
    description : string,
    price: number,
    icons : Types.ObjectId[] // ObjectID[] / string[]
}

const DishSchema = new Schema<IDish>({
    imgUrl: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    icons: [{type: Types.ObjectId, ref: "Icon"}]
});

export const DishModel = model("Dish",DishSchema);