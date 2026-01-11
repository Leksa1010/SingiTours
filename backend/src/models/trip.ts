import { Schema, model } from "mongoose";

export interface ITrip {
    title: string;
    slug: string;
    destination: any; // ObjectId
    price: number;
    startsAt: Date;
    endsAt: Date;
    description?: string;
    coverImageUrl?: string;
}

const tripSchema = new Schema<ITrip>(
    {
        title: { type: String, required: true, trim: true, maxlength: 120 },
        slug: { type: String, required: true, trim: true, unique: true, index: true },
        destination: { type: Schema.Types.ObjectId, ref: "Destination", required: true, index: true },
        price: { type: Number, required: true, min: 0 },
        startsAt: { type: Date, required: true },
        endsAt: { type: Date, required: true },
        description: { type: String, trim: true, maxlength: 5000 },
        coverImageUrl: { type: String, trim: true, maxlength: 500 },
    },
    { timestamps: true }
);

export default model<ITrip>("Trip", tripSchema);
