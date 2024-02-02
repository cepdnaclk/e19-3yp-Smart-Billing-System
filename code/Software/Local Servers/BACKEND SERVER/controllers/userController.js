import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { genPassword, validPassword } from "../utils/passwordUtils.js";

export async function getAllUsers(request, response) {
    try {
        const users = await User.find();

        if (users.length > 0) {
            return response.status(200).json({
                count: users.length,
                data: users,
            });
        } else {
            return response.status(404).json({ message: "No users found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching users." });
    }
}

export async function getUserById(request, response) {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: `Invalid user id`,
            });
        }

        const user = await User.findById(id).exec();

        if (user) {
            return response.status(200).json(user);
        } else {
            return response.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching users." });
    }
}

export async function saveNewUser(request, response) {
    try {
        if (
            !request.body.fullName ||
            !request.body.email ||
            !request.body.password ||
            !request.body.username
        ) {
            return response.status(400).send({
                message: `Send all required fields: full Name, email, password, username`,
            });
        }
        const saltHash = genPassword(request.body.password);

        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const newUser = {
            fullName: request.body.fullName,
            email: request.body.email,
            hash,
            salt,
            username: request.body.username,
        };

        const user = await User.create(newUser);
        return response.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
}

export async function updateUser(request, response) {
    try {
        if (
            !request.body.fullName ||
            !request.body.email ||
            !request.body.password ||
            !request.body.username
        ) {
            return response.status(400).send({
                message: `Send all required fields: full Name, email, password, username`,
            });
        }

        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: `Invalid user id`,
            });
        }

        const result = await User.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).send({
                message: `User not found`,
            });
        }

        return response.status(200).send({
            message: `User successfully updated!`,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
}

export async function deleteUserById(request, response) {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: `Invalid user id`,
            });
        }

        const result = await User.findByIdAndDelete(id);

        if (result) {
            return response.status(404).json({
                message: `User successfully deleted!`,
            });
        } else {
            return response.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching users." });
    }
}

export async function getUserByName(request, response) {
    try {
        const { username } = request.params;

        const user = await User.find({ username: username }).exec();

        if (user.length > 0) {
            return response.status(200).json(user);
        } else {
            return response.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching users." });
    }
}
