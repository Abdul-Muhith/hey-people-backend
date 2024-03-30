import asyncHandler from 'express-async-handler';

import Color from '../models/colorModel.js';

import validateMongodbId from '../utils/validateMongodbId.js';

// create a new Color

export const createNewColorController = asyncHandler(async (req, res) => {
        const newColor = await Color.create(req.body);

    if (!newColor) throw new Error("Couldn't create a new Color");

    res.json(newColor);
});

// Update a Color with ID

export const updateColorController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const updatedColor = await Color.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedColor) throw new Error("Couldn't update");

    res.json(updatedColor);
});

// Delete a single Color

export const deleteColorController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const deletedColor = await Color.findByIdAndDelete(id);

    if (!deletedColor) throw new Error("Couldn't find Color with this id");

    res.json(deletedColor);
});

// Get a single Color

export const getSingleColorController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const singleColor = await Color.findById(id);

    if (!singleColor) throw new Error("Not found minimum Color with ID");

    res.json(singleColor);
});

// Get all Colors

export const getAllColorsController = asyncHandler(async (req, res) => {
    const getAllColors = await Color.find();

    if (!getAllColors) throw new Error("Data not found");

    res.json(getAllColors);
});