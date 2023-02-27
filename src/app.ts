import express, { Application,NextFunction,Response,Request} from "express";
import { connectToMongoDB, mongoDB } from "./config/config";
import roomRouter from "./routes/rooms";
import roomTypeRouter from "./routes/roomType";
import userRouter from "./routes/users";

const app: Application = express();

connectToMongoDB(mongoDB);

// const roomTypeSchema = Joi.object({
//   name: Joi.string().required(),
// });

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/room-types", roomTypeRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

  
 