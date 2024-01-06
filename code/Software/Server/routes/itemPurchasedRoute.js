import express from "express";
import cors from "cors";

import {
    getAllItemsPurchased,
    getItemsPurchasedById,
    saveNewItemsPurchased,
    updateItemsPurchased,
    deleteItemsPurchasedById,
    getProductsSoldToday,
    getTotalProductQuantities
} from "../controllers/itemPurchasedController.js";

const router = express.Router();
router.use(cors());

// Route for get top selling products
//router.get("/topselling", getTopSellingProducts);

// Route for get total sale today
router.get("/saletoday", getProductsSoldToday);

router.get("/quantity", getTotalProductQuantities);

// Route for get all purchased item
router.get("/", getAllItemsPurchased);

// Route for get purchased item by id
router.get("/:id", getItemsPurchasedById);

// Route for Save a new purchased item
router.post("/", saveNewItemsPurchased);

// Route for update a purchased item
router.put("/:id", updateItemsPurchased);

// Route for delete purchased item by id
router.delete("/:id", deleteItemsPurchasedById);



export default router;