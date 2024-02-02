import mongoose from "mongoose";
import connection from "../config/database.js";

const billSchema = mongoose.Schema(
    {
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
        },
        discountApplied: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export const Bill = connection.model("Bill", billSchema);
