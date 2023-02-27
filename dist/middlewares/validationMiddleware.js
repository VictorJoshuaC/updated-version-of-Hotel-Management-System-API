"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomTypeJoiSchema = exports.roomSchemaJoi = exports.validateRoomType = exports.validateData = exports.schema = void 0;
const joi_1 = __importDefault(require("joi"));
// Define the validation schema
const schema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
exports.schema = schema;
const validateData = (schema) => {
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
exports.validateData = validateData;
// Validation middleware for room type
const roomTypeJoiSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
});
exports.roomTypeJoiSchema = roomTypeJoiSchema;
const validateRoomType = (req, res, next) => {
    const { error } = roomTypeJoiSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateRoomType = validateRoomType;
//pending
const roomSchemaJoi = joi_1.default.object({
    name: joi_1.default.string().required(),
    roomType: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
});
exports.roomSchemaJoi = roomSchemaJoi;
