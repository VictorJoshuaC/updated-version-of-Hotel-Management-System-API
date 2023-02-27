"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.RoomType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Room Type schema
const roomTypeSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true }
});
// Room schema
const roomSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    roomType: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'RoomType', required: true },
    price: { type: Number, required: true }
});
// Room Type model
const RoomType = mongoose_1.default.model('RoomType', roomTypeSchema);
exports.RoomType = RoomType;
// Room model
const Room = mongoose_1.default.model('Room', roomSchema);
exports.Room = Room;
