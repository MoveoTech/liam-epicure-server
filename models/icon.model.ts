import {model, Schema} from "mongoose";

export interface IIcon{
    imgUrl: string,
    description: string,
    status: number
}

const IconScehma = new Schema<IIcon>({
    imgUrl: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: Number, required: true}
});

export const IconModel = model("Icon", IconScehma);