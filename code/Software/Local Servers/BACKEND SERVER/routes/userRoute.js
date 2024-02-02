import express from "express";

import {
    getAllUsers,
    getUserById,
    saveNewUser,
    updateUser,
    deleteUserById,
    getUserByName,
} from "../controllers/userController.js";

const router = express.Router();

// Route for get all users
router.get("/", getAllUsers);

// Route for get user by id
router.get("/:id", getUserById);

// Route for Save a new User
router.post("/", saveNewUser);

// Route for update a User
router.put("/:id", updateUser);

// Route for delete user by id
router.delete("/:id", deleteUserById);

// Route for get user by name
router.get("/name/:username", getUserByName);

export default router;