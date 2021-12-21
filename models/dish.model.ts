import mongoose from "mongoose";

export interface IDish{
    imgUrl : string, // base64
    name: string,
    description : string,
    price: number,
    icons : any[] // ObjectID[] / string[]
}

const Schema = mongoose.Schema;
const DishSchema = new Schema<IDish>({
    imgUrl: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    icons: [{type: mongoose.Types.ObjectId, ref: "Icon"}]
});

export const DishModel = mongoose.model("Dish",DishSchema);