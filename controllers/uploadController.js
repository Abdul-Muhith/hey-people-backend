import fs from 'fs';

import asyncHandler from 'express-async-handler';

import Product from '../models/productModel.js';

import validateMongodbId from '../utils/validateMongodbId.js';
import { cloudinaryUploadImg, } from '../utils/cloudinary.js';

// Upload Product Image

export const uploadProductImageController = asyncHandler(async (req, res) => {
// AFTER CLASS 2
    // const { id } = req.params;
    // validateMongodbId(id);
    // console.log(req.files);
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    // console.log('working -> uploader ', uploader);

    if (!uploader) throw new Error(`not found uploader utils`);

    const urls = [];
    const files = req.files;

    for (const file of files) {
        const { path } = file;

    // console.log('path -> ', path);

        const newPath = await uploader(path);

    console.log('newPath -> ', newPath);

        urls.push(newPath);
        fs.unlinkSync(path);
    };

    // AFTER CLASS 2
    // const findProduct = await Product.findByIdAndUpdate(
    //     id,
    //     { images: urls.map((file) => { return file; }) },
    //     { new: true }
    // );
    // console.log('findProduct -> ', findProduct);

    const images = urls.map((file) => { return file; })
    res.json(images);

    console.log('images -> ', images);

    if (!findProduct) throw new Error('Could not upload image');

    res.json(findProduct);
});

// Delete Product Image

// TODO: cloudinary Delete Images - class 2

export const deleteProductImageController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    const deleted = cloudinaryUploadImg(id, "images");

    if (!deleted) throw new Error(`something wrong with delete image utils`);

    res.json({message: "Product image deleted", deleted});
});