import mongoose from "mongoose";
import { config } from "../configFile";

export const connect = async () => {
    await mongoose.connect(config.MONGO_URI)
        .then(() => console.log("Connected to DB"))
        .catch((err) => console.log("Failed to connect to DB", err.message));
}