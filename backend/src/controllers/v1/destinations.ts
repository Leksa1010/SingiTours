import type {Request, Response} from "express";
import Destination from "@/models/destination";

export const createDestination = async (req: Request, res: Response) => {
    const doc = await Destination.create(req.body);
    res.status(201).json({destination: doc});
};

export const listDestinations = async (_req: Request, res: Response) => {
    const docs = await Destination.find().lean().exec();
    res.status(200).json({destinations: docs});
};

export const getDestination = async (req: Request, res: Response) => {
    const doc = await Destination.findById(req.params.id).lean().exec();
    if (!doc) return res.status(404).json({
        code: "NotFound",
        message: "Destination not found"
    });

    res.status(200).json({destination: doc});
};

export const updateDestination = async (req: Request, res: Response) => {
    const doc = await Destination.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean().exec();
    if (!doc) return res.status(404).json({
        code: "NotFound",
        message: "Destination not found"
    });

    res.status(200).json({destination: doc});
};

export const deleteDestination = async (req: Request, res: Response) => {
    const doc = await Destination.findByIdAndDelete(req.params.id).exec();
    if (!doc) return res.status(404).json({
        code: "NotFound",
        message: "Destination not found"
    });
    res.status(200).json({
        message: "Destination deleted"
    });
};
