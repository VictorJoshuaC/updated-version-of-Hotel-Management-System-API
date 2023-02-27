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
// POST endpoint for storage of room types (only for admin users)
router.post("/api/v1/rooms-types", authMiddleware_1.verifyToken, (0, authMiddleware_1.verifyRole)("admin"), (req, res) => {
    const { error } = (0, validationMiddleware_1.validateRoomType)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const roomType = new roomModel_1.RoomType({
        name: req.body.name
    });
    roomType.save((err, roomType) => {
        if (err)
            return res.status(500).send(err);
        res.status(201).send(roomType);
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
router.post("/api/v1/rooms-types", authMiddleware_1.verifyToken, (0, authMiddleware_1.verifyRole)("admin"), validateData(validationMiddleware_1.roomTypeJoiSchema), (req, res) => {
    const roomType = new roomModel_1.RoomType({
        name: req.body.name
    });
    roomType.save((err, roomType) => {
        if (err)
            return res.status(500).send(err);
        res.status(201).send(roomType);
    });
});
exports.default = router;
