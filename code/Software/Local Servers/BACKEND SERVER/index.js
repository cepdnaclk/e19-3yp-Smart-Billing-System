import express from "express";
import { PORT } from "./config/app.js";
import cors from "cors";


import connection from "./config/database.js";
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
import "dotenv/config";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import billRouter from "./routes/billRoute.js";
import itemPurchasedRoute from "./routes/itemPurchasedRoute.js"

const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Middleware for handling routes
app.use("/users", userRouter);
app.use("/product", productRouter);
app.use("/bill", billRouter);
app.use("/itemPurchased", itemPurchasedRoute);

connection.on("connected", () => {
    app.listen(PORT, () => {
        console.log(`app is listening on port ${PORT}`);
    });
});