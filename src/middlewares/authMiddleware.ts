import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  jwt.verify(
    token,
    process.env.JWT_SECRET || "mysecretkey",
    (err: jwt.VerifyErrors | null, decoded: object | undefined) => {
      if (err) return res.status(401).send("Unauthorized");
      req.user = decoded;
      next();
    }
  );
};

// Middleware to verify user's role
const verifyRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) return res.status(403).send("Forbidden");
    next();
  };
};

export { verifyRole, verifyToken };
