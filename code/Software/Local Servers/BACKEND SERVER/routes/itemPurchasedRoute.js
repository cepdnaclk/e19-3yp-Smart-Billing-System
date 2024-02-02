import express from "express";
import cors from "cors";

import {
    getAllItemsPurchased,
    getItemsPurchasedById,
    saveNewItemsPurchased,
    updateItemsPurchased,
    deleteItemsPurchasedById,
    getProductsSoldToday,
    getTotalProductQuantities,
    deleteItemsPurchasedByBillId,
    getTopSellingProducts,
    gettopProducts
} from "../controllers/itemPurchasedController.js";

const router = express.Router();
router.use(cors());


// Route for get total sale today
router.get("/saletoday", getProductsSoldToday);

// Route for get total product quantities in today
router.get("/quantity/t", getTotalProductQuantities);

router.get("/topProducts",gettopProducts);

//Route for get top 3 selling products
router.get("/topselling", getTopSellingProducts);



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

//Route for delete purchased item by bill id
router.delete("/bill/:id", deleteItemsPurchasedByBillId);


export default router;