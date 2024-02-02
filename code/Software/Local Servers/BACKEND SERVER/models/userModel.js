import mongoose from "mongoose";
import connection from "../config/database.js";

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        username: {
            type: String,
            require: true,
            unique: true,
        },
        hash: {
            type: String,
        },
        salt: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const User = connection.model("User", userSchema);
