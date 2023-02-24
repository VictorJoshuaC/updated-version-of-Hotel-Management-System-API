const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const app = express();

// Connect to the database
mongoose.set('strictQuery',true);
const mongoDB = "mongodb+srv://username1:nYzSBYeX9fmd8hMU@cluster2.aepci1g.mongodb.net/hotel-database?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected')).catch(err => console.log(err))

// User schema
const userSchema = new mongoose.Schema({
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
const User = mongoose.model("User", userSchema);

// Room Type schema
const roomTypeSchema = new mongoose.Schema({
  name: String
});
// const roomTypeSchema = Joi.object({
//   name: Joi.string().required(),
// });


// Room schema
const roomSchema = new mongoose.Schema({
  name: String,
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType"
  },
  price: Number
});

// Room Type model
const RoomType = mongoose.model("RoomType", roomTypeSchema);

// Room model
const Room = mongoose.model("Room", roomSchema);



// Middleware for data validation
// function validateData(data,schema) {
 
//   const validation = schema.validate(data, { abortEarly: false });
//   if (validation.error) {
//     const errors = validation.error.details.map((err) => ({
//       field: err.path[0],
//       message: err.message,
//     }));
//     throw new Error(JSON.stringify(errors));
//   }
// }


// Define the validation schema
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Validate the data using the schema
// const data = { name: "John", email: "john@example.com", password: "password" };
// const validation = schema.validate(data, { abortEarly: false });

// // Check if there are any validation errors
// if (validation.error) {
//   const errors = validation.error.details.map((error) => error.message);
//   console.log(errors);
// } else {
//   console.log("Data is valid!");
// }

const validateDat = (schema) => {
  return (req, res, next) => {
    const data = req.body;
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).send({ errors });
    }
    next();
  };
};


// Register endpoint for creating a new user
app.post("/api/v1/register", async (req, res) => {
try {
  // Validate the request data
  validateData(req.body, Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(1024).required(),
    role: Joi.string().valid("guest", "admin")
  }));

  // Check if the user already exists
  let user = await User.findOne({ email: req.body.email });
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
  const token = jwt.sign(
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
  app.post("/api/v1/users/login", (req, res) => {
  const { email, password } = req.body;
  
  // Find the user with the given email
  User.findOne({ email: email }, (err, user) => {
  if (err) return res.status(500).send(err);
  if (!user) return res.status(401).send("Incorrect email or password");
  

  // Check if the password is correct
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) return res.status(500).send(err);
    if (!result) return res.status(401).send("Incorrect email or password");
  
    // Return the user's information with a JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "mysecretkey"
    );
    res.send({ user: user.toObject(), token });
  });
  });
  });

  // Validation middleware for room type
  const roomTypeJoiSchema = Joi.object({
    name: Joi.string().required(),
  });

  const validateRoomType = (req, res, next) => {
    const { error } = roomTypeJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
  
  //pending
  const roomSchemaJoi = Joi.object({
    name: Joi.string().required(),
    roomType: Joi.string().required(),
    price: Joi.number().required(),
  });
  // const validate = (schema) => {
  //   return (req, res, next) => {
  //     const { error } = schema.validate(req.body);
  //     if (error) return res.status(400).send(error.details[0].message);
  //     next();
  //   };
  // };
  
  
  
  


  // Middleware to verify JWT token
  const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");
  
  jwt.verify(token, process.env.JWT_SECRET || "mysecretkey", (err, decoded) => {
  if (err) return res.status(401).send("Unauthorized");
  req.user = decoded;
  next();
  });
  };
  
  // Middleware to verify user's role
  const verifyRole = (role) => {
    return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).send("Forbidden");
    next();
    };
  };
  
  // POST endpoint for storage of room types (only for admin users)
  app.post("/api/v1/rooms-types", verifyToken, verifyRole("admin"), (req, res) => {
    const { error } = validateRoomType(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
  const roomType = new RoomType({
    name: req.body.name
  });
  
  roomType.save((err, roomType) => {
    if (err) return res.status(500).send(err);
  res.status(201).send(roomType);
  });
  });
  
  // PATCH endpoint for editing a room using its id (only for admin users)
  app.patch("/api/v1/rooms/:id", verifyToken, verifyRole("admin"), (req, res) => {
  Room.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, room) => {
  if (err) return res.status(500).send(err);
  res.send(room);
  });
  });
  
  // DELETE endpoint for deleting a room using its id (only for admin users)
  app.delete("/api/v1/rooms/:id", verifyToken, verifyRole("admin"), (req, res) => {
  Room.findByIdAndRemove(req.params.id, (err, room) => {
  if (err) return res.status(500).send(err);
  res.send(room);
  });
  });
  
  
  
  
  // DELETE endpoint for deleting a room using its id (only for admin users)
  app.delete("/api/v1/rooms/:id", verifyToken, verifyRole("admin"), (req, res) => {
  Room.findByIdAndRemove(req.params.id, (err, room) => {
  if (err) return res.status(500).send(err);
  res.send(room);
  });
  });
  
  // Validation middleware using Joi
  const validateData = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
  return res.status(400).send(error.details[0].message);
  }
  next();
  };
  
  // POST endpoint for storage of room types (only for admin users)
  app.post("/api/v1/rooms-types", verifyToken, verifyRole("admin"), validateData(roomTypeJoiSchema), (req, res) => {
  const roomType = new RoomType({
  name: req.body.name
  });
  
  roomType.save((err, roomType) => {
  if (err) return res.status(500).send(err);
  res.status(201).send(roomType);
  });
  });
  
  // POST endpoint for storage of rooms (only for admin users)
  app.post("/api/v1/rooms", verifyToken, verifyRole("admin"), validateData(roomSchemaJoi), (req, res) => {
  const room = new Room({
  name: req.body.name,
  roomType: req.body.roomType,
  price: req.body.price
  });
  
  room.save((err, room) => {
  if (err) return res.status(500).send(err);
  res.status(201).send(room);
  });
  });
  
  // PATCH endpoint for editing a room using its id (only for admin users)
  app.patch("/api/v1/rooms/:id", verifyToken, verifyRole("admin"), validateData(roomSchemaJoi), (req, res) => {
  Room.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, room) => {
  if (err) return res.status(500).send(err);
  res.send(room);
  });
  });
  
  // GET endpoint for fetching all the rooms with filters
  app.get("/api/v1/rooms", (req, res) => {
  const search = req.query.search;
  const roomType = req.query.roomType;
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;
  
  Room.find({
  name: new RegExp(search, "i"),
  roomType: roomType,
  price: { $gte: minPrice, $lte: maxPrice }
  }, (err, rooms) => {
  if (err) return res.status(500).send(err);
  res.send(rooms);
  });
  });
  
  // GET endpoint for fetching a room using its id
  app.get("/api/v1/rooms/:id", (req, res) => {
  Room.findById(req.params.id, (err, room) => {
  if (err) return res.status(500).send(err);
  res.send(room);
  });
  });
  
  app.listen(3000, () => {
  console.log("Server started on port 3000");
  });
  
  
  
  