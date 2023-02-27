"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomModel_1 = require("../models/roomModel");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();

// Validation middleware using Joi
const validateData = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
// PATCH endpoint for editing a room using its id (only for admin users)
router.patch("/api/v1/rooms/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.verifyRole)("admin"), (req, res) => {
    roomModel_1.Room.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, room) => {
        if (err)
            return res.status(500).send(err);
        if (!room)
            return res.status(404).send('Room not found');
        res.send(room);
    });
});
// DELETE endpoint for deleting a room using its id (only for admin users)
router.delete("/api/v1/rooms/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.verifyRole)("admin"), (req, res) => {
    roomModel_1.Room.findByIdAndRemove(req.params.id, (err, room) => {
        if (err)
            return res.status(500).send(err);
        if (!room)
            return res.status(404).send('Room not found');
        res.send(room);
    });
});
// POST endpoint for storage of rooms (only for admin users)
router.post("/api/v1/rooms", authMiddleware_1.verifyToken, (0, authMiddleware_1.verifyRole)("admin"), validateData(validationMiddleware_1.roomSchemaJoi), (req, res) => {
    const room = new roomModel_1.Room({
        name: req.body.name,
        roomType: req.body.roomType,
        price: req.body.price
    });
    room.save((err, room) => {
        if (err)
            return res.status(500).send(err);
        res.status(201).send(room);
    });
});
// GET endpoint for fetching all the rooms with filters
router.get("/api/v1/rooms", (req, res) => {
    const search = req.query.search;
    const roomType = req.query.roomType;
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;
    roomModel_1.Room.find({
        name: new RegExp(search, "i"),
        roomType: roomType,
        price: { $gte: minPrice, $lte: maxPrice }
    }, (err, rooms) => {
        if (err)
            return res.status(500).send(err);
        res.send(rooms);
    });
});
// GET endpoint for fetching a room using its id
router.get("/api/v1/rooms/:id", (req, res) => {
    roomModel_1.Room.findById(req.params.id, (err, room) => {
        if (err)
            return res.status(500).send(err);
        if (!room)
            return res.status(404).send('Room not found');
        res.send(room);
    });
});

exports.default = router;
