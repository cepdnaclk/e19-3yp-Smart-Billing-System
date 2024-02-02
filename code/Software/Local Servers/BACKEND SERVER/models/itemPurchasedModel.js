import mongoose from "mongoose";
import connection from "../config/database.js";

const itemPurchasedSchema = mongoose.Schema(
    {
        billID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bill",
            required: true,
        },
        productID: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        unitPrice: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const ItemPurchased = connection.model(
    "ItemPurchased",
    itemPurchasedSchema
);
