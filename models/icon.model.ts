import {model, Schema} from "mongoose";

export interface IIcon{
    imgUrl: string, // base64
    meaning: string
}

const IconScehma = new Schema<IIcon>({
    imgUrl: {type: String, required: true},
    meaning: {type: String, required: true}
});

export const IconModel = model("Icon", IconScehma);