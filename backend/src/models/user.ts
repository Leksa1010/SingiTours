import {Schema, model} from 'mongoose';
import * as bcrypt from 'bcrypt';


export interface IUser {
    username: string;
    email: string;
    password: string;
    role: `operator` | 'traveller';
    firstName?: string,
    lastName?: string,
    socialLinks?: {
        website?: string;
        facebook?: string;
        linkedin?: string;
        instagram?: string;
        x?: string;
        youtube?: string;
    }
}

const userSchema = new Schema<IUser>({
        username: {
            type: String,
            required: [true, 'Username is required'],
            maxLength: [20, 'Username must not be greater than 20 characters'],
            unique: [true, 'Username must be unique'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            maxLength: [50, 'Email must not be greater than 50 characters'],
            unique: [true, 'Email must be unique'],
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['operator', 'traveller'],
                message: '{VALUE} is not supported',
            },
            default: 'traveller',
        },
        firstName: {
            type: String,
            maxLength: [20, 'First name must not be greater than 20 characters'],
            trim: true,
        },
        lastName: {
            type: String,
            maxLength: [20, 'Last name must not be greater than 20 characters'],
            trim: true,
        },
        socialLinks: {
            website: {
                type: String,
                maxLength: [80, 'Website URL must not be greater than 80 characters'],
                trim: true,
            },
            facebook: {
                type: String,
                maxLength: [80, 'Website URL must not be greater than 80 characters'],
                trim: true,
            },
            linkedin: {
                type: String,
                maxLength: [80, 'Website URL must not be greater than 80 characters'],
                trim: true,
            },
            instagram: {
                type: String,
                maxLength: [80, 'Website URL must not be greater than 80 characters'],
                trim: true,
            },
            x: {
                type: String,
                maxLength: [80, 'Website URL must not be greater than 80 characters'],
                trim: true,
            },
            youtube: {
                type: String,
                maxLength: [80, 'Website URL must not be greater than 80 characters'],
                trim: true,
            }
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

export default model<IUser>("User", userSchema);