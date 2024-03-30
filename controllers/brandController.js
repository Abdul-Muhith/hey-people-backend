import asyncHandler from 'express-async-handler';

import Brand from '../models/brandModel.js';

import validateMongodbId from '../utils/validateMongodbId.js';

// create a new Brand

export const createNewBrandController = asyncHandler(async (req, res) => {
        const newBrand = await Brand.create(req.body);

    if (!newBrand) throw new Error("Couldn't create a new Brand");

    res.json(newBrand);
});

// Update a Brand with ID

export const updateBrandController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBrand) throw new Error("Couldn't update");

    res.json(updatedBrand);
});

// Delete a single Brand

export const deleteBrandController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) throw new Error("Couldn't find Brand with this id");

    res.json(deletedBrand);
});

// Get a single Brand

export const getSingleBrandController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const singleBrand = await Brand.findById(id);

    if (!singleBrand) throw new Error("Not found minimum Brand with ID");

    res.json(singleBrand);
});

// Get all Brands

export const getAllBrandsController = asyncHandler(async (req, res) => {
    const getAllBrands = await Brand.find();

    if (!getAllBrands) throw new Error("Data not found");

    res.json(getAllBrands);
});