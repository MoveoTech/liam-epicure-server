import { Request, Response } from "express"
import { IUser, UserModel } from "models/user.model";
import { config } from "configFile";
import jwt from "jsonwebtoken";

export const postLogin = async (req: Request, res: Response) => {
    try {

        // Validate body data matchs UserModel
        const { userModel, error } = validateAndGetUser(req.body);
        if (error) {
            throw new Error(error.message);
        }

        // Search for user
        const user = await UserModel.findOne({ username: userModel.username, status: 1 });

        if (!user) {
            throw new Error("User does not exist.");
        }

        // Validate password
        if (user.password !== userModel.password) {
            throw new Error("Wrong password.");
        }

        // Assign a token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            config.JWT_KEY,
            { expiresIn: "3h" });

        user.token = token;
        await user.save();

        res.status(200).json(user);
    } catch (error: any) {
        res.statusMessage = error.message;
        res.status(500).json(error);
    }
}

function validateAndGetUser(data: any) {
    const user: IUser = data; // Get only relevant data
    const userModel = new UserModel(user); // Create a UserModel instance
    const error = userModel.validateSync(); // validate user properties
    return { userModel, error };
}