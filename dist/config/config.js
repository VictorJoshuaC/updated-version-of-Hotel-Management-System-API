"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDB = exports.connectToMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function connectToMongoDB(mongoDB) {
    // Connect to the database
    mongoose_1.default.set("strictQuery", true);
    mongoose_1.default
        .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
        console.log("connected");
    })
        .catch((err) => {
        console.log(err);
    });
}
exports.connectToMongoDB = connectToMongoDB;
const mongoDB = "mongodb+srv://username1:nYzSBYeX9fmd8hMU@cluster2.aepci1g.mongodb.net/hotel-database?retryWrites=true&w=majority";
exports.mongoDB = mongoDB;
