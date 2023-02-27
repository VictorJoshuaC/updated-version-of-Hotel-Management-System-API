"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.verifyRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// // Middleware for data validation
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
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).send("Unauthorized");
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "mysecretkey", (err, decoded) => {
        if (err)
            return res.status(401).send("Unauthorized");
        req.user = decoded;
        next();
    });
};
exports.verifyToken = verifyToken;
// Middleware to verify user's role
const verifyRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role)
            return res.status(403).send("Forbidden");
        next();
    };
};
exports.verifyRole = verifyRole;
