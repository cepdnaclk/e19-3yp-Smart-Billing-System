import express from "express";

import {
    getAllProducts,
    getProductById,
    getProductByProductId,
    saveNewProduct,
    updateProduct,
    deleteProductById,
} from "../controllers/productController.js";

const router = express.Router();

// Route for get all products
router.get("/", getAllProducts);

// Route for get product by id
router.get("/:id", getProductById);

// Route for get product by id
router.get("/productID/:id", getProductByProductId);

// Route for Save a new product
router.post("/", saveNewProduct);

// Route for update a Product
router.put("/:id", updateProduct);

// Route for delete product by id
router.delete("/:id", deleteProductById);

export default router;
