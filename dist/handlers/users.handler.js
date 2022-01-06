"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = void 0;
const user_model_1 = require("models/user.model");
const configFile_1 = require("configFile");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const postLogin = async (req, res) => {
    try {
        // Validate body data matchs UserModel
        const { userModel, error } = validateAndGetUser(req.body);
        if (error) {
            throw new Error(error.message);
        }
        // Search for user
        const user = await user_model_1.UserModel.findOne({ username: userModel.username, status: 1 });
        if (!user) {
            throw new Error("User does not exist.");
        }
        // Validate password
        if (user.password !== userModel.password) {
            throw new Error("Wrong password.");
        }
        // Assign a token
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, configFile_1.config.JWT_KEY, { expiresIn: "3h" });
        user.token = token;
        await user.save();
        res.status(200).json(user);
    }
    catch (error) {
        res.statusMessage = error.message;
        res.status(500).json(error);
    }
};
exports.postLogin = postLogin;
function validateAndGetUser(data) {
    const user = data; // Get only relevant data
    const userModel = new user_model_1.UserModel(user); // Create a UserModel instance
    const error = userModel.validateSync(); // validate user properties
    return { userModel, error };
}
