import { Types, model, Schema } from "mongoose";

export interface IWeeklyChef {
    chef: Types.ObjectId | string,
    status: number
}

const SignatureDishSchema = new Schema<IWeeklyChef>({
    chef: { type: Types.ObjectId, ref: "Chef", required: true },
    status: { type: Number, required: true }
})

export const WeeklyChefModel = model("Weekly-Chef", SignatureDishSchema);