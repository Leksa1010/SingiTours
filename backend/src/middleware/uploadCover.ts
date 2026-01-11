import multer, {FileFilterCallback} from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    if (!ok) return cb(new Error("Only jpg/png/webp allowed"));
    return cb(null, true);
};

export const uploadCover = multer({ storage, fileFilter, limits: { fileSize: 3 * 1024 * 1024 } });
