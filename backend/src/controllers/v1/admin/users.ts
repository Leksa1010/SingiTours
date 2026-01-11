import type { Request, Response } from "express";
import User from "@/models/user";

export const listTravellers = async (_req: Request, res: Response): Promise<void> => {
    const users = await User.find({ role: "traveller" })
        .select("username email role createdAt")
        .lean()
        .exec();

    res.status(200).json({ users });
};

export const getTravellerById = async (req: Request, res: Response): Promise<void> => {
    const user = await User.findOne({ _id: req.params.id, role: "traveller" })
        .select("username email role firstName lastName socialLinks createdAt")
        .lean()
        .exec();

    if (!user) {
        res.status(404).json({ code: "NotFound", message: "Traveller not found" });
        return;
    }

    res.status(200).json({ user });
};

export const deleteTravellerById = async (req: Request, res: Response): Promise<void> => {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, role: "traveller" }).exec();

    if (!deleted) {
        res.status(404).json({ code: "NotFound", message: "Traveller not found" });
        return;
    }

    res.status(200).json({ message: "Traveller deleted" });
};
