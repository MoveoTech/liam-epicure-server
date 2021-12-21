import {Types, model, Schema} from "mongoose";

export interface IChef{
    imgUrl : string, // base64
    firstName : string,
    lastName : string,
    description : string,
    restaurants : Types.ObjectId[]
}

const ChefSchema = new Schema<IChef>({
    imgUrl: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    description: {type: String},
    restaurants: [{type: Types.ObjectId, ref: "Restaurant"}]
});

export const ChefModel = model("Chef",ChefSchema);