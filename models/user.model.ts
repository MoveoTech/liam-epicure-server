import { model, Schema } from "mongoose";

export interface IUser {
    username: string,
    password: string,
    token?: string,
    status?: number
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String , default: ""},
    status: { type: Number, required: true, default: 1 } 
});

export const UserModel = model("User", UserSchema);