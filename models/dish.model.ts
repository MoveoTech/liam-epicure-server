import { Types, model, Schema } from "mongoose";

export interface IDish {
    imgUrl: string, // base64
    name: string,
    description: string,
    price: number,
    restaurant: Types.ObjectId | string,
    icons: Types.ObjectId[] | string[],
    status: number
}

const DishSchema = new Schema<IDish>({
    imgUrl: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    restaurant: {type: Types.ObjectId, ref: "Restaurant"},
    icons: [{ type: Types.ObjectId, ref: "Icon" }],
    status: {type: Number, required: true}
});

export const DishModel = model("Dish", DishSchema);