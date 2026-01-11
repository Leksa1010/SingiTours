import {Schema, model, Types} from "mongoose";

interface IToken {
    token: string;
    userId: Types.ObjectId;
    createdAt: Date;
}

const tokenSchema = new Schema<IToken>(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    },
    {timestamps: true}
);

tokenSchema.index({ userId: 1 }, { unique: true }); // 1 refresh token per user

export default model<IToken>("Token", tokenSchema);