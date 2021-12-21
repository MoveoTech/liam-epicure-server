import mongoose from "mongoose";

export interface IIcon{
    imgUrl: string, // base64
    meaning: string
}

const Schema = mongoose.Schema;
const IconScehma = new Schema<IIcon>({
    imgUrl: {type: String, required: true},
    meaning: {type: String, required: true}
});

export const IconModel = mongoose.model("Icon", IconScehma);