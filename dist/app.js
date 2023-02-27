"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const rooms_1 = __importDefault(require("./routes/rooms"));
const roomType_1 = __importDefault(require("./routes/roomType"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
(0, config_1.connectToMongoDB)(config_1.mongoDB);
// const roomTypeSchema = Joi.object({
//   name: Joi.string().required(),
// });
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1/rooms", rooms_1.default);
app.use("/api/v1/user", users_1.default);
app.use("/api/v1/room-types", roomType_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

app.get("/", (req, res) => {
    res.send("hello world")
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
