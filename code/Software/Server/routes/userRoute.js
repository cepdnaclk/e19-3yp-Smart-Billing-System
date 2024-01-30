import express from "express";
const router = express.Router();
// Assuming that the userController.js file is in the same directory as the userRoute.js file
import {
    loginUser,
    signupUser,
} from '../controllers/userController.js';

// Route for login a User
router.post("/login", loginUser);

// Route for signup a User
router.post("/signup", signupUser);

export default router;