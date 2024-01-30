import mongoose from "mongoose";
import connection from "../config/database.js";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        username: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        confirmPassword: {
            type: String,
            require: true,
        },
    },
    // {
    //     timestamps: true,
    // }
);

//static method to signup user

userSchema.statics.signup = async function (fullName, email, username, password, confirmPassword) {

    //validation 

    if(!fullName || !email || !username || !password || !confirmPassword) {
        throw new Error("Please fill all the fields");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Email is invalid");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
    

    const exits = await this.findOne({ email });

    if (exits) {
        throw new Error("Email already exits");
    }
    if (password !== confirmPassword) {
        throw new Error("Password and Confirm Password does not match");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);

    const user = await this.create({
        fullName,
        email,
        username,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
    });

    return user;

}

// static method to login user

userSchema.statics.login = async function (email, password) {
    //validation
    if (!email || !password) {
        throw new Error("Please fill all the fields");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Email is invalid");
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw new Error("Email does not exits");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Password is incorrect");
    }

    return user;
}

export const User = connection.model("User", userSchema);
