import express from "express";

import {
    getAllBills,
    getBillById,
    saveNewBill,
    updateBill,
    deleteBillById,
    getBillsToday,
    getBillCountPerdate
} from "../controllers/billController.js";

const router = express.Router();

// Route for get bills today
router.get("/today", getBillsToday);

router.get("/billCountPerDay/:day",getBillCountPerdate)
// Route for get all bills
router.get("/", getAllBills);

// Route for get bill by id
router.get("/:id", getBillById);

// Route for Save a new bill
router.post("/", saveNewBill);

// Route for update a bill
router.put("/:id", updateBill);

// Route for delete bill by id
router.delete("/:id", deleteBillById);


export default router;
