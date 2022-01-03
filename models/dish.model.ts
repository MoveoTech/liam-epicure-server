import { Types, model, Schema } from "mongoose";

export interface IDish {
    imgUrl: string | null, // base64
    name: string,
    description: string | null,
    price: number | null,
    restaurant: Types.ObjectId | string | null,
    icons: Types.ObjectId[] | string[],
    status: number
}

const DishSchema = new Schema<IDish>({
    imgUrl: { type: String, default: null },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: null },
    restaurant: { type: Types.ObjectId, ref: "Restaurant", default: null },
    icons: [{ type: Types.ObjectId, ref: "Icon" }],
    status: { type: Number, required: true }
});

export const DishModel = model("Dish", DishSchema);