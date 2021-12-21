import mongoose from "mongoose";

export interface IChef{
    imgUrl : string, // base64
    firstName : string,
    lastName : string,
    description : string,
    restaurants : any[]
}

const Schema = mongoose.Schema;
const ChefSchema = new Schema<IChef>({
    imgUrl: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    description: {type: String},
    restaurants: [{type: mongoose.Types.ObjectId, ref: "Restaurant"}]
});

export const ChefModel = mongoose.model("Chef",ChefSchema);