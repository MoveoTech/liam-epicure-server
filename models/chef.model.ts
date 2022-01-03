import { Types, model, Schema } from "mongoose";

export interface IChef {
    imgUrl: string | null,
    firstName: string,
    lastName: string,
    description: string | null,
    restaurants: Types.ObjectId[] | string[],
    status: number
}

const ChefSchema = new Schema<IChef>({
    imgUrl: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    description: { type: String, default: null },
    restaurants: [{ type: Types.ObjectId, ref: "Restaurant" }],
    status: { type: Number, required: true }
});

export const ChefModel = model("Chef", ChefSchema);