import express, { Request, Response, Router } from "express";
import { Room } from "../models/roomModel";
import { roomSchemaJoi } from '../middlewares/validationMiddleware';
import { verifyRole, verifyToken } from '../middlewares/authMiddleware';

const router: Router = express.Router();

// Validation middleware using Joi
const validateData = (schema: any) => (req: Request, res: Response, next: any) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

// PATCH endpoint for editing a room using its id (only for admin users)
router.patch("/api/v1/rooms/:id", verifyToken, verifyRole("admin"), (req: Request, res: Response) => {
  Room.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err: Error, room: Room | null) => {
    if (err) return res.status(500).send(err);
    if (!room) return res.status(404).send('Room not found');
    res.send(room);
  });
});

// router.patch("/api/v1/rooms/:id", verifyToken, verifyRole("admin"), (req: Request, res: Response) => {
//   Room.findByIdAndUpdate(
//     req.params.id, 
//     req.body, 
//     { 
//       upsert: false, 
//       returnDocument: "after" 
//     }, 
//     (err: Error, room: Room | null) => {
//       if (err) return res.status(500).send(err);
//       if (!room) return res.status(404).send('Room not found');
//       res.send(room);
//     }
//   );
// });


// DELETE endpoint for deleting a room using its id (only for admin users)
router.delete("/api/v1/rooms/:id", verifyToken, verifyRole("admin"), (req: Request, res: Response) => {
  Room.findByIdAndRemove(req.params.id, (err: Error, room: Room | null) => {
    if (err) return res.status(500).send(err);
    if (!room) return res.status(404).send('Room not found');
    res.send(room);
  });
});

// POST endpoint for storage of rooms (only for admin users)
router.post("/api/v1/rooms", verifyToken, verifyRole("admin"), validateData(roomSchemaJoi), (req: Request, res: Response) => {
  const room = new Room({
    name: req.body.name,
    roomType: req.body.roomType,
    price: req.body.price
  });

  room.save((err: Error, room: Room) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(room);
  });
});

// GET endpoint for fetching all the rooms with filters
router.get("/api/v1/rooms", (req: Request, res: Response) => {
  const search = req.query.search;
  const roomType = req.query.roomType;
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;

  Room.find({
    name: new RegExp(search, "i"),
    roomType: roomType,
    price: { $gte: minPrice, $lte: maxPrice }
  }, (err: Error, rooms: Room[]) => {
    if (err) return res.status(500).send(err);
    res.send(rooms);
  });
});

// GET endpoint for fetching a room using its id
router.get("/api/v1/rooms/:id", (req: Request, res: Response) => {
  Room.findById(req.params.id, (err: Error, room: Room | null) => {
    if (err) return res.status(500).send(err);
    if (!room) return res.status(404).send('Room not found');
    res.send(room);
  });
});



export default router;
