import mongoose, { Schema, Document } from "mongoose";

// User interface
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "guest" | "admin";
}

// User schema
const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    role: {
        type: String,
        enum: ["guest", "admin"],
        default: "guest"
    }
});

// User model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
