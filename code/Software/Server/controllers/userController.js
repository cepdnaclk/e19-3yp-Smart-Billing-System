import {User} from "../models/userModel.js";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

// login user
export const loginUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        //create token
        const token = createToken(user._id);

        res.status(200).json(token);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
    
};

// signup user

export const signupUser = async (req, res) => {
    const { fullName, email, username, password, confirmPassword } = req.body;
    try {
        const user = await User.signup(fullName, email, username, password, confirmPassword);
        //create token
        const token = createToken(user._id);

        res.status(201).json(token);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};
