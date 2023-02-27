"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const userModel_1 = require("../models/userModel");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const router = express_1.default.Router();
// Register endpoint for creating a new user
router.post("/api/v1/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request data
        (0, validationMiddleware_1.validateData)(req.body, joi_1.default.object({
            name: joi_1.default.string().min(3).max(50).required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(6).max(1024).required(),
            role: joi_1.default.string().valid("guest", "admin")
        }));
        // Check if the user already exists
        let user = yield userModel_1.User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send("User already registered.");
        // Create a new user and hash the password
        user = new userModel_1.User({
            name: req.body.name,
            email: req.body.email,
            password: yield bcrypt_1.default.hash(req.body.password, 10),
            role: req.body.role || "guest"
        });
        // Save the user to the database
        yield user.save();
        // Return the user's information with a JWT token
        const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "mysecretkey");
        res.status(201).send({ user: user.toObject(), token });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred while logging in" });
    }
}));
// POST endpoint for user login
router.post("/api/v1/users/login", (req, res) => {
    const { email, password } = req.body;
    // Find the user with the given email
    userModel_1.User.findOne({ email: email }, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(500).send(err);
        if (!user)
            return res.status(401).send("Incorrect email or password");
        // Check if the password is correct
        const result = yield bcrypt_1.default.compare(password, user.password);
        if (!result)
            return res.status(401).send("Incorrect email or password");
        // Return the user's information with a JWT token
        const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "mysecretkey");
        res.send({ user: user.toObject(), token });
    }));
});
exports.default = router;
