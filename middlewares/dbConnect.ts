import mongoose from "mongoose";

export const connect = async () => {
    await mongoose.connect("mongodb://localhost/epicureDB")
        .then(() => console.log("Connected to DB"))
        .catch((err) => console.log("Failed to connect to DB", err.message));
}