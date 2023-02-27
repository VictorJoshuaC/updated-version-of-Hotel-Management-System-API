import express, { Request, Response, Router } from "express";
import { RoomType } from "../models/roomModel";
import { validateRoomType, roomTypeJoiSchema } from '../middlewares/validationMiddleware'
import { verifyRole, verifyToken } from '../middlewares/authMiddleware'

const router: Router = express.Router();

// POST endpoint for storage of room types (only for admin users)
router.post("/api/v1/rooms-types", verifyToken, verifyRole("admin"), (req: Request, res: Response) => {
  const { error } = validateRoomType(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const roomType = new RoomType({
    name: req.body.name
  });

  roomType.save((err: any, roomType: RoomType) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(roomType);
  });
});


// Validation middleware using Joi
const validateData = (schema: any) => (req: Request, res: Response, next: Function) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

// POST endpoint for storage of room types (only for admin users)
router.post("/api/v1/rooms-types", verifyToken, verifyRole("admin"), validateData(roomTypeJoiSchema), (req: Request, res: Response) => {
  const roomType = new RoomType({
    name: req.body.name
  });

  roomType.save((err: any, roomType: RoomType) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(roomType);
  });
});

export default router;
