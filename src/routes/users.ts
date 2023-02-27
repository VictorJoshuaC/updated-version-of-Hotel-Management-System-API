import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi from "joi";

import User from "../models/userModel";
import { validateData } from "../middlewares/validationMiddleware";

const router: Router = express.Router();

// Register endpoint for creating a new user
router.post("/api/v1/register", async (req: Request, res: Response) => {
  try {
    // Validate the request data
    validateData(req.body, Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(1024).required(),
      role: Joi.string().valid("guest", "admin")
    }));

    // Check if the user already exists
    let user: User | null = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    // Create a new user and hash the password
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      role: req.body.role || "guest"
    });

    // Save the user to the database
    await user.save();

    // Return the user's information with a JWT token
    const token: string = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "mysecretkey"
    );
    res.status(201).send({ user: user.toObject(), token });

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "An error occurred while logging in" });
  }
});

// POST endpoint for user login
router.post("/api/v1/users/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user with the given email
  User.findOne({ email: email }, async (err: any, user: User | null) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send("Incorrect email or password");

    // Check if the password is correct
    const result = await bcrypt.compare(password, user.password);
    if (!result) return res.status(401).send("Incorrect email or password");

    // Return the user's information with a JWT token
    const token: string = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "mysecretkey"
    );
    res.send({ user: user.toObject(), token });
  });
});

export default router;
