import multer from 'multer';
// import sharp from 'sharp';
import fs from 'fs';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images/")); // cloud provide / after images
    },
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb({ message: "Unsupported file format" }, false);
    }
};

export const uploadPhotoMiddleware = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000 }, // file size can be 1000000
});

export const productImgResizeMiddleware = async (req, res, next) => {
    if (!req.files) return next();

    // await Promise.all(
    //     req.files.map(async (file) => {

    //         await sharp(file.path)
    //             .resize(300, 300)
    //             .toFormat("jpeg")
    //             .jpeg({ quality: 90 })
    //             .toFile(`public/images/products/${file.filename}`);
    //         fs.unlinkSync(`public/images/products/${file.filename}`);
    //     })
    // );
    next();
};

export const blogImgResizeMiddleware = async (req, res, next) => {
    if (!req.files) return next();

    // await Promise.all(
    //     req.files.map(async (file) => {
    //         await sharp(file.path)
    //             .resize(300, 300)
    //             .toFormat("jpeg")
    //             .jpeg({ quality: 90 })
    //             .toFile(`public/images/blogs/${file.filename}`);
    //         fs.unlinkSync(`public/images/blogs/${file.filename}`);
    //     })
    // );
    next();
};