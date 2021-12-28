import { Types, model, Schema } from "mongoose";

export interface ISignatureDish {
    dish: Types.ObjectId | string,
    status: number
}

const SignatureDishSchema = new Schema<ISignatureDish>({
    dish: { type: Types.ObjectId, ref: "Dish", required: true },
    status: { type: Number, required: true }
})

export const SignatureDishModel = model("Signature-Dish", SignatureDishSchema);