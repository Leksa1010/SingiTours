import type { Request, Response } from "express";
import User from "@/models/user";

export const getMe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const me = await User.findById(userId).select("-password").lean().exec();
    if (!me) {
        res.status(404).json({ code: "NotFound", message: "User not found" });
        return;
    }
    res.status(200).json({ user: me });
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    // whitelist
    const update: any = {};
    if (req.body.firstName !== undefined) update.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) update.lastName = req.body.lastName;
    if (req.body.socialLinks !== undefined) update.socialLinks = req.body.socialLinks;

    const me = await User.findByIdAndUpdate(userId, update, { new: true })
        .select("-password")
        .lean()
        .exec();

    if (!me) {
        res.status(404).json({ code: "NotFound", message: "User not found" });
        return;
    }
    res.status(200).json({ user: me });
};

export const deleteMe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    await User.findByIdAndDelete(userId).exec();
    res.status(200).json({ message: "Account deleted" });
};
