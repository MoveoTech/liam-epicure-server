import {Types, model, Schema} from "mongoose";

export interface IChef{
    imgUrl : string,
    firstName : string,
    lastName : string,
    description : string,
    restaurants : Types.ObjectId[] | string[],
    status: number
}

const ChefSchema = new Schema<IChef>({
    imgUrl: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    description: {type: String},
    restaurants: [{type: Types.ObjectId, ref: "Restaurant"}],
    status: {type: Number, required: true}
});

export const ChefModel = model("Chef",ChefSchema);