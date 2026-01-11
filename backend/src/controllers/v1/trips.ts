import type { Request, Response } from "express";
import Trip from "@/models/trip";
import { makeSlug } from "@/utils/slug";

export const listTrips = async (req: Request, res: Response) => {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limitRaw = parseInt(String(req.query.limit ?? "10"), 10) || 10;
    const limit = Math.min(Math.max(limitRaw, 1), 100);
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.destination) filter.destination = req.query.destination;
    if (req.query.minPrice) filter.price = { ...(filter.price || {}), $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(req.query.maxPrice) };

    const sortParam = String(req.query.sort ?? "-createdAt"); // e.g. price,-createdAt
    const sort: any = {};
    sortParam.split(",").forEach((k) => {
        const key = k.trim();
        if (!key) return;
        if (key.startsWith("-")) sort[key.slice(1)] = -1;
        else sort[key] = 1;
    });

    const [items, total] = await Promise.all([
        Trip.find(filter).populate("destination").sort(sort).skip(skip).limit(limit).lean().exec(),
        Trip.countDocuments(filter),
    ]);

    res.status(200).json({
        items,
        meta: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
};

export const getTripBySlug = async (req: Request, res: Response) => {
    const trip = await Trip.findOne({ slug: req.params.slug }).populate("destination").lean().exec();
    if (!trip) return res.status(404).json({ code: "NotFound", message: "Trip not found" });
    res.status(200).json({ trip });
};

export const createTrip = async (req: Request, res: Response) => {
    const { title, destination, price, startsAt, endsAt, description } = req.body;

    const baseSlug = makeSlug(title);
    let slug = baseSlug;
    let i = 2;
    while (await Trip.exists({ slug })) {
        slug = `${baseSlug}-${i++}`;
    }

    const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const trip = await Trip.create({
        title,
        slug,
        destination,
        price: Number(price),
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        description,
        coverImageUrl,
    });

    res.status(201).json({ trip });
};

export const updateTrip = async (req: Request, res: Response) => {
    const update: any = { ...req.body };

    // Types normalization (no strings in db)
    if (update.price !== undefined) {
        update.price = Number(update.price);
    }

    if (update.startsAt) {
        update.startsAt = new Date(update.startsAt);
    }

    if (update.endsAt) {
        update.endsAt = new Date(update.endsAt);
    }

    // If title is changed, regenerate slug
    if (update.title) {
        const baseSlug = makeSlug(update.title);
        let slug = baseSlug;
        let i = 2;
        while (await Trip.exists({ slug, _id: { $ne: req.params.id } })) {
            slug = `${baseSlug}-${i++}`;
        }
        update.slug = slug;
    }

    if (req.file) {
        update.coverImageUrl = `/uploads/${req.file.filename}`;
    }

    const trip = await Trip.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true }
    ).lean().exec();

    if (!trip) {
        return res.status(404).json({
            code: "NotFound",
            message: "Trip not found",
        });
    }

    res.status(200).json({ trip });
};

export const deleteTrip = async (req: Request, res: Response) => {
    const trip = await Trip.findByIdAndDelete(req.params.id).exec();
    if (!trip) return res.status(404).json({
        code: "NotFound",
        message: "Trip not found" });
    res.status(200).json({ message: "Trip deleted" });
};
