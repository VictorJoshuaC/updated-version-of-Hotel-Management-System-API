import mongoose, { Schema, Document } from 'mongoose';

// Room Type interface
interface RoomType extends Document {
    name: string;
}

// Room Type schema
const roomTypeSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true }
});

// Room interface
interface Room extends Document {
    name: string;
    roomType: RoomType['_id'];
    price: number;
}

// Room schema
const roomSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true },
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType', required: true },
    price: { type: Number, required: true }
});

// Room Type model
const RoomType = mongoose.model<RoomType>('RoomType', roomTypeSchema);

// Room model
const Room = mongoose.model<Room>('Room', roomSchema);

export { RoomType, Room };
