import asyncHandler from 'express-async-handler';

import ProductCategory from '../models/productCategoryModel.js';

import validateMongodbId from '../utils/validateMongodbId.js';

// create a new category

export const createNewCategoryController = asyncHandler(async (req, res) => { 
        const newCategory = await ProductCategory.create(req.body);

    if (!newCategory) throw new Error("Couldn't create a new Category");

    res.json(newCategory);
});

// Update a category with ID

export const updateCategoryController = asyncHandler(async (req, res) => { 
    const { id } = req.params;
    validateMongodbId(id);

    const updatedCategory = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCategory) throw new Error("Couldn't update");

    res.json(updatedCategory);
});

// Delete a single category

export const deleteCategoryController = asyncHandler(async (req, res) => { 
    const { id } = req.params;
    validateMongodbId(id);

    const deletedCategory = await ProductCategory.findByIdAndDelete(id);

    if (!deletedCategory) throw new Error("Couldn't find category with this id");

    res.json(deletedCategory);
});

// Get a single category

export const getSingleCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const singleCategory = await ProductCategory.findById(id);

    if (!singleCategory) throw new Error("Not found minimun Category with ID");

    res.json(singleCategory);
});

// Get all categories

export const getAllCategoriesController = asyncHandler(async (req, res) => {
    const getAllCategories = await ProductCategory.find();

    if (!getAllCategories) throw new Error("Data not found");

    res.json(getAllCategories);
});