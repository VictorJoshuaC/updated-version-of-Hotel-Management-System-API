
import mongoose from "mongoose";

function connectToMongoDB(mongoDB: string): void {
  // Connect to the database
  mongoose.set("strictQuery", true);
  mongoose
    .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("connected");
    })
    .catch((err) => {
      console.log(err);
    });
}

const mongoDB: string =
  "mongodb+srv://username1:nYzSBYeX9fmd8hMU@cluster2.aepci1g.mongodb.net/hotel-database?retryWrites=true&w=majority";

export { connectToMongoDB, mongoDB };

