import { Schema, model } from "mongoose";

export interface IDestination {
    name: string;
    country?: string;
    description?: string;
}

const destinationSchema = new Schema<IDestination>(
    {
        name: { type: String, required: true, trim: true, maxlength: 80, unique: true },
        country: { type: String, trim: true, maxlength: 80 },
        description: { type: String, trim: true, maxlength: 1000 },
    },
    { timestamps: true }
);

export default model<IDestination>("Destination", destinationSchema);
